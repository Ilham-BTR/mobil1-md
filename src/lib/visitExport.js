import { excelDateSerial } from './excelDates';
import { VISIT_PHOTO_MAP } from './storage';

const PHOTO_COLUMNS = Object.values(VISIT_PHOTO_MAP).map(photo => photo.col);
const EXPORT_PHOTO_SKIP = new Set(['photo_spanduk_after', 'photo_poster_after']);
const EXPORT_PHOTO_HEADER = {
  photo_tampak_depan: 'link_tampak_depan', photo_in: 'link_in', photo_out: 'link_out',
  photo_spanduk_before: 'link_spanduk_biru', photo_spanduk_putih: 'link_spanduk_putih', photo_spanduk_after: 'link_spanduk_after',
  photo_poster_before: 'link_poster_biru', photo_poster_putih: 'link_poster_putih', photo_poster_after: 'link_poster_after',
  photo_poster_ncp: 'link_poster_ncp', photo_poster_bcp: 'link_poster_bcp',
  photo_delivery_gimmick: 'link_delivery_gimmick', photo_deploy_planogram: 'link_deploy_planogram',
};
const XL_EPOCH = Date.UTC(1899, 11, 30);

export function visitToCSVRow(visit, ctx) {
  const bengkel = ctx.bengkelById.get(visit.bengkel_id);
  const kota = bengkel ? ctx.kotaById.get(bengkel.kota_id) : null;
  const region = kota ? ctx.regionById.get(kota.region_id) : null;
  const distributor = ctx.distributorById?.get(visit.distributor_id) ?? null;
  const md = ctx.mdById.get(visit.md_id);
  const photoCount = visit.photo_count ?? PHOTO_COLUMNS.filter(key => visit[key]).length;
  return {
    visit_id: visit.id,
    tanggal: excelDateSerial(visit.visit_date),
    waktu_submit: excelDateTimeSerial(visit.created_at),
    md_name: md?.full_name || visit.md_name || '',
    md_email: md?.email || visit.md_email || '',
    bengkel_code: bengkel?.code || '',
    bengkel_name: bengkel?.name || visit.bengkel_name || '',
    bengkel_alamat: bengkel?.address || '',
    kota: kota?.name || visit.kota_name || '',
    region: region?.name || visit.region_name || '',
    distributor: distributor?.name || visit.distributor_name || '',
    pic_name: visit.pic_name || '',
    pic_phone: visit.pic_phone || '',
    status: visit.status,
    sub_type: visit.sub_type || '',
    remarks: visit.remarks || '',
    bengkel_lat: bengkel?.lat ?? '',
    bengkel_lng: bengkel?.lng ?? '',
    visit_lat: visit.visit_lat ?? '',
    visit_lng: visit.visit_lng ?? '',
    photo_count: photoCount,
    ...Object.fromEntries(PHOTO_COLUMNS.filter(key => !EXPORT_PHOTO_SKIP.has(key)).map(key => [
      EXPORT_PHOTO_HEADER[key] || ('link_' + key.replace(/^photo_/, '')),
      typeof visit[key] === 'string' && visit[key].startsWith('http') ? visit[key] : (visit[key] ? '(foto lokal/idb)' : ''),
    ])),
    created_at: visit.created_at || '',
  };
}

export async function exportVisitsXlsx(visits, ctx, filename) {
  if (!visits?.length) return;
  const XLSX = await import('xlsx');
  let toExport = visits;
  if (!visits.some(visit => PHOTO_COLUMNS.some(key => visit[key]))) {
    try {
      const photoMap = await ctx.fetchVisitPhotosMap(visits.map(visit => visit.id));
      toExport = visits.map(visit => ({ ...visit, ...(photoMap.get(visit.id) || {}) }));
    } catch (error) {
      console.warn('Gagal tarik foto untuk export (kolom link foto kosong):', error?.message);
    }
  }
  const worksheet = XLSX.utils.json_to_sheet(toExport.map(visit => visitToCSVRow(visit, ctx)), { cellDates: true });
  setColDateFormat(XLSX, worksheet, 'tanggal', 'dd/mm/yyyy');
  setColDateFormat(XLSX, worksheet, 'waktu_submit', 'dd/mm/yyyy hh:mm');
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Visits');
  XLSX.writeFile(workbook, filename);
}

export function setColDateFormat(XLSX, worksheet, header, format) {
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  let column = -1;
  for (let c = range.s.c; c <= range.e.c; c++) {
    const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c })];
    if (cell && String(cell.v) === header) { column = c; break; }
  }
  if (column < 0) return;
  for (let r = 1; r <= range.e.r; r++) {
    const cell = worksheet[XLSX.utils.encode_cell({ r, c: column })];
    if (cell && (cell.t === 'd' || cell.t === 'n') && cell.v != null) cell.z = format;
  }
}

function excelDateTimeSerial(timestamp) {
  if (!timestamp) return '';
  const wib = new Date(new Date(timestamp).getTime() + 7 * 3600000);
  return (Date.UTC(wib.getUTCFullYear(), wib.getUTCMonth(), wib.getUTCDate(), wib.getUTCHours(), wib.getUTCMinutes(), wib.getUTCSeconds()) - XL_EPOCH) / 86400000;
}
