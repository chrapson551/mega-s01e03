<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, causeOf, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  const merged = uniqueById(reports as Report[]).filter(r => r.mergedInto === 4471);
  const review = new Set(notes.oneDayMove);
  const groups = [
    { label: 'Shared parser', rows: merged.filter(r => causeOf(r, tenantOf(r)) === 'parser') },
    { label: 'booking-v3 hint', rows: merged.filter(r => causeOf(r, tenantOf(r)) === 'hint') }
  ];
</script>

<p>{reports.length} export rows; {merged.length} unique reports in #4471. Deduplicate by ID before counting.</p>
<table>
  <thead><tr><th>Problem</th><th>Unique reports</th></tr></thead>
  <tbody>{#each groups as group}<tr><td>{group.label}</td><td>{group.rows.length}</td></tr>{/each}</tbody>
</table>
<p>{merged.filter(r => review.has(r.id)).length} reports have unusual symptoms flagged by the desk. They are included in parser coverage and retained below as diagnostic notes.</p>
<details>
  <summary>Diagnostic notes within the parser ticket</summary>
  <ul>{#each merged.filter(r => review.has(r.id)) as r}<li><code>{r.id}</code>: {r.body}</li>{/each}</ul>
</details>
