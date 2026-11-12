import fs from 'node:fs';
import path from 'node:path';
import { causeOf, uniqueById, groupByCause } from './kb-export/support-kb/src/lib/kb/causes.ts';

const root = new URL('./kb-export/support-kb/src/lib/data/', import.meta.url);
const reports = JSON.parse(fs.readFileSync(new URL('reports-4471.json', root), 'utf8'));
const notes = JSON.parse(fs.readFileSync(new URL('desk-notes.json', root), 'utf8'));
const tenants = fs.readdirSync(new URL('tenants/', root)).map(f => JSON.parse(fs.readFileSync(new URL(`tenants/${f}`, root), 'utf8')));
const byHandle = new Map(tenants.map(t => [t.handle, t]));
const unique = uniqueById(reports);
const merged = unique.filter(r => r.mergedInto === 4471);
const conflicts = reports.filter((r,i) => reports.findIndex(x => x.id === r.id) < i && JSON.stringify(r) !== JSON.stringify(reports.find(x => x.id === r.id)));
const groups = groupByCause(merged, r => byHandle.get(r.tenant));
const summary = {
  rawRows: reports.length, uniqueReports: unique.length, mergedReports: merged.length,
  duplicateRows: reports.length - unique.length, conflictingDuplicateIds: [...new Set(conflicts.map(r => r.id))],
  unmatchedTenants: [...new Set(unique.filter(r => !byHandle.has(r.tenant)).map(r => r.tenant))],
  groups: groups.map(({ reports: rows, ...g }) => ({ ...g, count: rows.length,
    reportIds: rows.map(r => r.id),
    intakeDisagreements: rows.filter(r => r.meta.intakeTag !== g.cause).length,
    oneDayReports: rows.filter(r => notes.oneDayMove.includes(r.id)),
    examples: rows.slice(0, 3),
    tenantDetails: [...new Set(rows.map(r => r.tenant))].map(h => byHandle.get(h))
  })),
  notMerged: unique.filter(r => r.mergedInto !== 4471),
  receivedByMonth: Object.fromEntries([...new Set(merged.map(r => r.receivedAt.slice(0,7)))].sort().map(m => [m, merged.filter(r => r.receivedAt.startsWith(m)).length])),
  mergedByMonth: Object.fromEntries([...new Set(merged.map(r => r.mergedAt?.slice(0,7)))].sort().map(m => [m, merged.filter(r => r.mergedAt?.startsWith(m)).length]))
};
fs.writeFileSync(new URL('./analysis.json', import.meta.url), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify({ ...summary, groups: summary.groups.map(({reportIds,oneDayReports,examples,tenantDetails,...g}) => ({...g, oneDayReports: oneDayReports.map(r => ({id:r.id,body:r.body})), examples, tenantDetails})), notMerged: summary.notMerged.length }, null, 2));
