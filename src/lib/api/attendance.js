// src/lib/api/attendance.js
// Absen (Masuk & Pulang) — tabel attendances / view attendance_details.
import { supabase, MOCK_MODE } from '../supabase';
import { uploadAttendancePhoto } from '../storage';
import { MOCK_DATA, persistMock, mockAtt } from './_mock';

// Absen MD untuk 1 tanggal (null kalau belum absen).
export async function fetchTodayAttendance(mdId, date) {
  if (MOCK_MODE) return mockAtt().find(a => a.md_id === mdId && a.date === date) || null;
  const { data, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('md_id', mdId)
    .eq('date', date)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Riwayat absen milik 1 MD (terbaru dulu). Query tabel langsung (RLS: MD lihat miliknya).
export async function fetchAttendances(mdId, limit = 60) {
  if (MOCK_MODE) return mockAtt().filter(a => a.md_id === mdId).sort((a, b) => b.date.localeCompare(a.date));
  const { data, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('md_id', mdId)
    .order('date', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

// Rekap absen semua MD (admin) untuk 1 BULAN (YYYY-MM) — view attendance_details.
export async function fetchAttendancesByMonth(month) {
  const start = month + '-01';
  const [y, m] = month.split('-');
  const lastDay = new Date(Number(y), Number(m), 0).getDate();
  const end = `${month}-${String(lastDay).padStart(2, '0')}`;
  if (MOCK_MODE) return mockAtt().filter(a => a.date >= start && a.date <= end);
  const { data, error } = await supabase
    .from('attendance_details')
    .select('*')
    .gte('date', start).lte('date', end)
    .order('date', { ascending: false })
    .order('check_in_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

// Rekap absen semua MD (admin) untuk RENTANG tanggal (YYYY-MM-DD .. YYYY-MM-DD).
export async function fetchAttendancesByRange(dari, sampai) {
  if (MOCK_MODE) return mockAtt().filter(a => (!dari || a.date >= dari) && (!sampai || a.date <= sampai));
  let q = supabase.from('attendance_details').select('*');
  if (dari) q = q.gte('date', dari);
  if (sampai) q = q.lte('date', sampai);
  const { data, error } = await q
    .order('date', { ascending: false })
    .order('check_in_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

/**
 * Hapus 1 record absen (super_admin only — di-enforce RLS attendances_admin_delete).
 * Foto selfie di B2 dibiarkan (orphan, best-effort dibersihkan terpisah).
 */
export async function deleteAttendance(id) {
  if (MOCK_MODE) {
    MOCK_DATA.attendances = mockAtt().filter(a => a.id !== id);
    persistMock();
    return;
  }
  const { data, error } = await supabase.from('attendances').delete().eq('id', id).select('id');
  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('Absen tidak terhapus (0 baris). Pastikan login sebagai super admin — hanya super admin yang boleh menghapus.');
  }
}

// Absen masuk: upload selfie, buat baris absen hari ini (upsert by md_id+date).
export async function checkIn({ mdId, date, lat, lng, photoFile, photoUrl: preUrl, note }) {
  const photoUrl = preUrl || (photoFile ? await uploadAttendancePhoto(photoFile, mdId, date, 'in') : null);
  const payload = {
    md_id: mdId, date,
    check_in_at: new Date().toISOString(),
    check_in_lat: lat, check_in_lng: lng,
    check_in_photo: photoUrl, check_in_note: note || null,
  };
  if (MOCK_MODE) {
    const row = { id: 'att_' + Date.now(), ...payload };
    mockAtt().push(row);
    persistMock();
    return row;
  }
  const { data, error } = await supabase
    .from('attendances')
    .upsert(payload, { onConflict: 'md_id,date' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Absen pulang: upload selfie, update baris hari ini.
export async function checkOut({ mdId, date, lat, lng, photoFile, photoUrl: preUrl, note }) {
  const photoUrl = preUrl || (photoFile ? await uploadAttendancePhoto(photoFile, mdId, date, 'out') : null);
  const patch = {
    check_out_at: new Date().toISOString(),
    check_out_lat: lat, check_out_lng: lng,
    check_out_photo: photoUrl, check_out_note: note || null,
  };
  if (MOCK_MODE) {
    const row = mockAtt().find(a => a.md_id === mdId && a.date === date);
    if (!row) throw new Error('Belum absen masuk hari ini');
    Object.assign(row, patch);
    persistMock();
    return row;
  }
  const { data, error } = await supabase
    .from('attendances')
    .update(patch)
    .eq('md_id', mdId)
    .eq('date', date)
    .select()
    .single();
  if (error) throw error;
  return data;
}
