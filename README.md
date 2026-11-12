# S01E03 — what it shows

Evidence and knowledge-base pages for [MEGA.dev challenge S01E03](https://hq.mega.dev/challenges/what-it-shows).

## Prepared

- Extracted knowledge base: `kb-export/support-kb/`.
- Counts and report evidence: `analysis.json`.
- Two issue bodies: `draft-issues/`.
- Exact report coverage: `issue-manifest.json`.
- Signed page: `kb-export/support-kb/src/routes/kb/incidents/4471-reviewed/+page.svx`.
- Proposed decision: `kb-export/support-kb/src/routes/kb/decisions/0002-dedupe-by-evidence/+page.svx`.
- Standalone styled HTML: `rendered/4471-reviewed.html`.
- Full rendered KB: `kb-export/support-kb/build/`.
- Verification results: `verification.json`.

## Reproduce

With Node 22, run `node --experimental-strip-types analyze.mjs`, then `node prepare.mjs`. Inside `kb-export/support-kb`, run `npm ci` and `npm run build`. Back in this folder, run `node --experimental-strip-types verify.mjs`. `node preview.mjs` serves the rendered KB at http://127.0.0.1:4174/kb/ and the standalone page at http://127.0.0.1:4174/4471-reviewed.html.

427 exported rows deduplicate to 412 report IDs, without conflicting duplicates or missing tenants. The supplied classifier assigns 379 reports to parser and 33 to hint. Five reports in the parser bucket have unusual symptoms flagged in desk-notes.json. They remain diagnostic notes within the parser issue and do not establish a third problem. The preparation script verifies each report is assigned exactly once.

## Publication and course review

Repository publication and course-requested corrections were approved by the account owner. Course acceptance is pending; publication alone does not complete the challenge. The initial five-report issue is closed as a duplicate of the parser issue; its evidence is retained in that issue and the KB.

The course's engineering update marks #4471 closed on 05 Oct: parser fixed, hint won't fix because booking-v3 was retired. The corresponding repository issues are closed with those distinct outcomes. This does not establish that both bugs received a code fix.

Build and local verification passed. Browser checks confirmed the rendered signature, report counts, working links, stale triage warning, and a mobile layout without horizontal overflow. The standalone page has three embedded stylesheets, no scripts, and no browser console errors. Local logs and state in `.private/`, dependencies, and temporary Svelte build internals are ignored and must not be published. The course explicitly requires its issued proof as the signed page's frontmatter value; it is included there intentionally.

The repository preserves the original accepted decision as history and adds a proposed replacement. Reproduction is required before any unusual symptom is classified as an additional problem.
