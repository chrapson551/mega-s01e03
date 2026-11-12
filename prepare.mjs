import fs from 'node:fs';
const base = new URL('./', import.meta.url);
const summary = JSON.parse(fs.readFileSync(new URL('analysis.json', base), 'utf8'));
const ambiguous = summary.groups.flatMap(g => g.oneDayReports);
const parser = summary.groups.find(g => g.cause === 'parser').reportIds;
const hint = summary.groups.find(g => g.cause === 'hint').reportIds;
const definitions = [
  { key: 'parser', title: 'Shared parser treats day-first tenant dates as month-first', ids: parser,
    description: 'The shared parser interprets dates as MM/DD even when the tenant uses day-first dates. This swaps month and day, for example 7 April becomes 4 July (R-41200). Resolve the tenant locale from the tenant directory, rather than the reporter browser locale or intake tag. Coverage follows the supplied causeOf rule: 379 unique reports, including five flagged by desk-notes.json. Those unusual symptoms remain diagnostic notes within this ticket; they do not establish a separate problem.',
    reproduction: 'For Harbour Dental (en-GB, booking-v2), enter 07/04/2026 through the affected app flow. Expected: 7 April 2026. Observed in R-41200: 4 July.\n\nDiagnostic follow-up for the five flagged reports (included in this count):\n\n' + ambiguous.map(r => `${r.id}: ${r.body}`).join('\n\n') + '\n\nCheck original dates, invite payloads, tenant settings, and dispatch logs before inferring any additional cause. No timezone or dispatch defect is established by these symptoms alone.',
    acceptance: 'Parse according to the explicit tenant date convention or accept an unambiguous typed date. Verify app, email, and booking-v2 paths; check all tenant locales using Intl date parts. Preserve month-first tenant behavior. Count each report ID once.' },
  { key: 'hint', title: 'booking-v3 prints MM/DD/YYYY for forms that read day-first dates', ids: hint,
    description: 'booking-v3 prints MM/DD/YYYY, but the form interprets input using the day-first tenant locale. Following the hint produces the wrong date. This affects form reports from Copper Studio (es-ES), Alder Physio (de-DE), and Pale Harbour (pt-PT). It is a distinct input-hint bug and requires its own fix even after the shared parser is corrected.',
    reproduction: 'For Copper Studio, select booking-v3. Following the MM/DD/YYYY hint, type 01/06/2026 for January 6. The day-first form reads June 1, matching R-41230. This is a reproduction derived from the documented form behavior; the export contains no running booking application.',
    acceptance: 'Make the displayed hint and date interpretation agree with the tenant locale. Test all three affected tenants and both form versions. Confirm the shared parser change alone does not leave a misleading booking-v3 hint.' }
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
