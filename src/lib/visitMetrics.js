export function aggregateVisitTotals(visits) {
  let total = 0;
  let pemasangan = 0;
  let revisit = 0;
  const activeMdIds = new Set();
  for (const visit of visits) {
    total++;
    if (visit.status === 'Pemasangan') pemasangan++;
    if (visit.status === 'Revisit') revisit++;
    activeMdIds.add(visit.md_id);
  }
  return { total, pemasangan, revisit, activeMdCount: activeMdIds.size };
}

export function aggregateVisitsByMd(visits, month = null, { dari = '', sampai = '' } = {}) {
  const metrics = new Map();

  for (const visit of visits) {
    if (dari || sampai) {
      if (dari && visit.visit_date < dari) continue;
      if (sampai && visit.visit_date > sampai) continue;
    } else if (month && !visit.visit_date.startsWith(month)) {
      continue;
    }

    let row = metrics.get(visit.md_id);
    if (!row) {
      row = { total: 0, pemasangan: 0, revisit: 0, activeDates: new Set() };
      metrics.set(visit.md_id, row);
    }

    row.total++;
    if (visit.status === 'Pemasangan') row.pemasangan++;
    if (visit.status === 'Revisit') row.revisit++;
    row.activeDates.add(visit.visit_date);
  }

  for (const row of metrics.values()) {
    row.activeDays = row.activeDates.size;
    delete row.activeDates;
  }

  return metrics;
}
