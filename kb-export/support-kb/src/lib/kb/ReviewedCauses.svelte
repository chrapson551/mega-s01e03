<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, causeOf, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  const merged = uniqueById(reports as Report[]).filter(r => r.mergedInto === 4471);
  const review = new Set(notes.oneDayMove);
  const groups = [
    { label: 'Shared parser', rows: merged.filter(r => !review.has(r.id) && causeOf(r, tenantOf(r)) === 'parser') },
    { label: 'booking-v3 hint', rows: merged.filter(r => !review.has(r.id) && causeOf(r, tenantOf(r)) === 'hint') },
    { label: 'Anomalous dates: investigation, cause unconfirmed', rows: merged.filter(r => review.has(r.id)) }
  ];
</script>

<p>{reports.length} export rows; {merged.length} unique reports in #4471. Deduplicate by ID before counting.</p>
<table>
  <thead><tr><th>Problem / investigation</th><th>Unique reports</th></tr></thead>
  <tbody>{#each groups as group}<tr><td>{group.label}</td><td>{group.rows.length}</td></tr>{/each}</tbody>
</table>
<p>The original tenant classifier places {groups[0].rows.length + groups[2].rows.length} reports under parser. The investigation group is excluded from confirmed parser coverage here.</p>
<details>
  <summary>Read the anomalous reports before merging them</summary>
  <ul>{#each groups[2].rows as r}<li><code>{r.id}</code>: {r.body}</li>{/each}</ul>
</details>
