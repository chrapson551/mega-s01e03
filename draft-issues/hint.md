# booking-v3 prints MM/DD/YYYY for forms that read day-first dates

## Scope

33 unique reports from source ticket #4471, in the 2026-10-04 export.

booking-v3 prints MM/DD/YYYY, but the form interprets input using the day-first tenant locale. Following the hint produces the wrong date. This affects form reports from Copper Studio (es-ES), Alder Physio (de-DE), and Pale Harbour (pt-PT). It is a distinct input-hint bug and requires its own fix even after the shared parser is corrected.

## Reproduction / evidence

For Copper Studio, select booking-v3. Following the MM/DD/YYYY hint, type 01/06/2026 for January 6. The day-first form reads June 1, matching R-41230. This is a reproduction derived from the documented form behavior; the export contains no running booking application.

## Acceptance criteria

Make the displayed hint and date interpretation agree with the tenant locale. Test all three affected tenants and both form versions. Confirm the shared parser change alone does not leave a misleading booking-v3 hint.

## Source and coverage

Source: support-kb/src/lib/data/reports-4471.json, tenant directory, causes.ts, and desk-notes.json. Analysis: analysis.json. Deduplicate by report ID.

Report IDs (33):

R-41230, R-41241, R-41251, R-41259, R-41262, R-41275, R-41294, R-41305, R-41308, R-41366, R-41372, R-41384, R-41387, R-41396, R-41400, R-41406, R-41415, R-41416, R-41418, R-41428, R-41439, R-41441, R-41449, R-41453, R-41456, R-41460, R-41472, R-41485, R-41493, R-41539, R-41572, R-41582, R-41584
