# Investigate five anomalous date reports merged into parser ticket #4471

## Scope

5 unique reports from source ticket #4471, in the 2026-10-04 export.

These reports describe one-day shifts, a timezone-dependent date, or an invite arriving before booking, rather than a demonstrated month/day swap. desk-notes.json flags all five. The tenant-based classifier currently files them under parser anyway. Keep them in a separate investigation; timezone, DST, scheduling, and clock behavior are hypotheses, not established causes. The five reports may need further splitting after reproduction.

## Reproduction / evidence

R-41202: Invite says Tuesday 12 May. Calendar says Monday 11 May. My client turned up on the Monday. We had coffee.

R-41209: Every booking in June is one day off. Only June. Why only June.

R-41236: The invite arrived before I made the booking. I would like to know how.

R-41344: Client in Lisbon got Tuesday. Client in Toronto got Monday. Same meeting. We held it twice.

R-41620: Tuesday 6 October showed as Monday. I moved it myself. I have stopped reporting these but my colleague says it helps you.

## Acceptance criteria

Obtain original input, expected/actual date and time, tenant/user timezone, generated invite, and dispatch logs for each report. Reproduce before naming a root cause. Separate further if evidence shows different failures; reconcile counts and report IDs when moving reports.

## Source and coverage

Source: support-kb/src/lib/data/reports-4471.json, tenant directory, causes.ts, and desk-notes.json. Analysis: analysis.json. Deduplicate by report ID.

Report IDs (5):

R-41202, R-41209, R-41236, R-41344, R-41620
