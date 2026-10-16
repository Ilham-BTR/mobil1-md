const XL_EPOCH = Date.UTC(1899, 11, 30);

export function excelDateSerial(value) {
  if (!value) return '';
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return '';
  return Math.round((Date.UTC(year, month - 1, day) - XL_EPOCH) / 86400000);
}
