import fs from 'node:fs';
const base = new URL('./', import.meta.url);
const summary = JSON.parse(fs.readFileSync(new URL('analysis.json', base), 'utf8'));
const ambiguous = summary.groups.flatMap(g => g.oneDayReports);
const ambiguousIds = new Set(ambiguous.map(r => r.id));
const parser = summary.groups.find(g => g.cause === 'parser').reportIds.filter(id => !ambiguousIds.has(id));
const hint = summary.groups.find(g => g.cause === 'hint').reportIds;
const definitions = [
  { key: 'parser', title: 'Shared parser treats day-first tenant dates as month-first', ids: parser,
    description: 'The shared parser interprets dates as MM/DD even when the tenant uses day-first dates. This swaps month and day, for example 7 April becomes 4 July (R-41200). Resolve the tenant locale from the tenant directory, rather than the reporter browser locale or intake tag. The audited count excludes five anomalous reports that the existing classifier assigns here without evidence of a month/day swap.',
    reproduction: 'For Harbour Dental (en-GB, booking-v2), enter 07/04/2026 through the affected app flow. Expected: 7 April 2026. Observed in R-41200: 4 July.',
    acceptance: 'Parse according to the explicit tenant date convention or accept an unambiguous typed date. Verify app, email, and booking-v2 paths; check all tenant locales using Intl date parts. Preserve month-first tenant behavior. Count each report ID once.' },
  { key: 'hint', title: 'booking-v3 prints MM/DD/YYYY for forms that read day-first dates', ids: hint,
    description: 'booking-v3 prints MM/DD/YYYY, but the form interprets input using the day-first tenant locale. Following the hint produces the wrong date. This affects form reports from Copper Studio (es-ES), Alder Physio (de-DE), and Pale Harbour (pt-PT). It is a distinct input-hint bug and requires its own fix even after the shared parser is corrected.',
    reproduction: 'For Copper Studio, select booking-v3. Following the MM/DD/YYYY hint, type 01/06/2026 for January 6. The day-first form reads June 1, matching R-41230. This is a reproduction derived from the documented form behavior; the export contains no running booking application.',
    acceptance: 'Make the displayed hint and date interpretation agree with the tenant locale. Test all three affected tenants and both form versions. Confirm the shared parser change alone does not leave a misleading booking-v3 hint.' },
  { key: 'one-day-investigation', title: 'Investigate five anomalous date reports merged into parser ticket #4471', ids: ambiguous.map(r => r.id),
    description: 'These reports describe one-day shifts, a timezone-dependent date, or an invite arriving before booking, rather than a demonstrated month/day swap. desk-notes.json flags all five. The tenant-based classifier currently files them under parser anyway. Keep them in a separate investigation; timezone, DST, scheduling, and clock behavior are hypotheses, not established causes. The five reports may need further splitting after reproduction.',
    reproduction: ambiguous.map(r => `${r.id}: ${r.body}`).join('\n\n'),
    acceptance: 'Obtain original input, expected/actual date and time, tenant/user timezone, generated invite, and dispatch logs for each report. Reproduce before naming a root cause. Separate further if evidence shows different failures; reconcile counts and report IDs when moving reports.' }
];
fs.mkdirSync(new URL('draft-issues/', base), { recursive: true });
for (const d of definitions) {
  const text = `# ${d.title}\n\n## Scope\n\n${d.ids.length} unique reports from source ticket #4471, in the 2026-10-04 export.\n\n${d.description}\n\n## Reproduction / evidence\n\n${d.reproduction}\n\n## Acceptance criteria\n\n${d.acceptance}\n\n## Source and coverage\n\nSource: support-kb/src/lib/data/reports-4471.json, tenant directory, causes.ts, and desk-notes.json. Analysis: analysis.json. Deduplicate by report ID.\n\nReport IDs (${d.ids.length}):\n\n${d.ids.join(', ')}\n`;
  fs.writeFileSync(new URL(`draft-issues/${d.key}.md`, base), text);
}
fs.writeFileSync(new URL('issue-manifest.json', base), JSON.stringify(definitions.map(({key,title,ids}) => ({key,title,count:ids.length,reportIds:ids})), null, 2)+'\n');
const assigned = definitions.flatMap(d => d.ids);
if (assigned.length !== 412 || new Set(assigned).size !== 412) throw Error('Coverage is not an exact partition');
console.log(definitions.map(d => `${d.key}: ${d.ids.length}`).join('\n'));
console.log('Coverage verified: 412 unique reports, assigned once each.');
