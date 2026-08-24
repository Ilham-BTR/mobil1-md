// src/lib/api/auth.js
// Auth (email/password + reset) & Passkey/WebAuthn (login biometrik server-side).
import { supabase, MOCK_MODE } from '../supabase';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { MOCK_DATA } from './_mock';

// ============================================================
// AUTH
// ============================================================
export async function signIn(email, password) {
  if (MOCK_MODE) {
    await new Promise(r => setTimeout(r, 600));
    const profile = MOCK_DATA.profiles.find(p => p.email === email.toLowerCase());
    // Password yang diterima: password akun ini (kalau di-set) ATAU 'mobil1' (default demo)
    const expected = profile?.login_password || 'mobil1';
    if (!profile || (password !== expected && password !== 'mobil1')) {
      throw new Error('Email atau password salah');
    }
    localStorage.setItem('mock_user_id', profile.id);
    return profile;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const { data: profile, error: pError } = await supabase
    .from('profiles')
    .select('*, region:regions!region_id(*)')
    .eq('id', data.user.id)
    .single();
  if (pError) throw pError;

  return profile;
}

export async function signOut() {
  if (MOCK_MODE) {
    localStorage.removeItem('mock_user_id');
    return;
  }
  await supabase.auth.signOut();
}

export async function sendPasswordReset(email) {
  if (MOCK_MODE) {
    await new Promise(r => setTimeout(r, 800));
    return { ok: true };
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password',
  });
  if (error) throw error;
  return { ok: true };
}

export async function getCurrentProfile() {
  if (MOCK_MODE) {
    const id = localStorage.getItem('mock_user_id');
    return MOCK_DATA.profiles.find(p => p.id === id) || null;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, region:regions!region_id(*)')
    .eq('id', user.id)
    .single();
  return profile;
}

// ============================================================
// PASSKEY / WEBAUTHN (login biometrik server-side, tanpa simpan password)
// ============================================================

// Cek perangkat punya platform authenticator (fingerprint/Face ID) & mode produksi
export async function isPasskeySupported() {
  if (MOCK_MODE) return false;
  if (typeof window === 'undefined' || !window.PublicKeyCredential) return false;
  try {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

// Daftar passkey milik user yang sedang login (untuk tampil/hapus)
export async function listPasskeys() {
  if (MOCK_MODE) return [];
  const { data, error } = await supabase
    .from('webauthn_credentials')
    .select('id, device_label, created_at, last_used_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Hapus 1 passkey milik sendiri ("Lupakan passkey")
export async function deletePasskey(id) {
  if (MOCK_MODE) return;
  const { error } = await supabase.from('webauthn_credentials').delete().eq('id', id);
  if (error) throw error;
}

// Aktifkan passkey di perangkat ini (user HARUS sudah login)
export async function enablePasskey(label) {
  if (MOCK_MODE) throw new Error('Passkey hanya tersedia di mode Supabase (produksi)');

  const { data: opts, error: e1 } = await supabase.functions.invoke('webauthn', {
    body: { action: 'reg-options' },
  });
  if (e1) throw new Error(e1.message || 'Gagal minta opsi registrasi');
  if (opts?.error) throw new Error(opts.error);

  let attResp;
  try {
    attResp = await startRegistration({ optionsJSON: opts });
  } catch (err) {
    if (err?.name === 'InvalidStateError') throw new Error('Passkey sudah terdaftar di perangkat ini.');
    if (err?.name === 'NotAllowedError') throw new Error('Pendaftaran biometrik dibatalkan.');
    throw err;
  }

  const { data: res, error: e2 } = await supabase.functions.invoke('webauthn', {
    body: { action: 'reg-verify', response: attResp, label: label || navigator.userAgent.slice(0, 80) },
  });
  if (e2) throw new Error(e2.message || 'Verifikasi gagal');
  if (res?.error) throw new Error(res.error);
  return res; // { verified: true }
}

// Login pakai passkey (discoverable — tidak perlu ketik email). Return profile.
export async function loginWithPasskey() {
  if (MOCK_MODE) throw new Error('Passkey hanya tersedia di mode Supabase (produksi)');

  const { data: opts, error: e1 } = await supabase.functions.invoke('webauthn', {
    body: { action: 'auth-options' },
  });
  if (e1) throw new Error(e1.message || 'Gagal minta opsi login');
  if (opts?.error) throw new Error(opts.error);

  let asr;
  try {
    asr = await startAuthentication({ optionsJSON: opts });
  } catch (err) {
    if (err?.name === 'NotAllowedError') throw new Error('Verifikasi biometrik dibatalkan / tidak ada passkey.');
    throw err;
  }

  const { data: res, error: e2 } = await supabase.functions.invoke('webauthn', {
    body: { action: 'auth-verify', response: asr },
  });
  if (e2) throw new Error(e2.message || 'Verifikasi gagal');
  if (res?.error) throw new Error(res.error);
  if (!res?.token_hash) throw new Error('Token sesi tidak diterima');

  // Tukar token jadi sesi Supabase asli (tanpa password)
  const { data: sess, error: e3 } = await supabase.auth.verifyOtp({
    token_hash: res.token_hash,
    type: 'magiclink',
  });
  if (e3) throw e3;

  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('*, region:regions!region_id(*)')
    .eq('id', sess.user.id)
    .single();
  if (pErr) throw pErr;
  return profile;
}
