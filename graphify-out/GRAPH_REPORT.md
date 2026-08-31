# Graph Report - Mobil1  (2026-08-31)

## Corpus Check
- 71 files · ~1,436,050 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 578 nodes · 777 edges · 58 communities (50 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `74774d37`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- _mock.js
- App UI Components
- Backup & Restore Docs
- Fresh Setup Schema
- Seed Generator Scripts
- master.js
- package.json
- dependencies
- import-ardiansyah.mjs
- import-visits.mjs
- 0001_schema.sql
- monthLabel
- laporan_visit
- Backblaze B2 Photo Storage
- measure.mjs
- useBackDismiss
- backup.mjs
- visit_details
- visit_details
- visit_details
- ops/backup/backup.mjs
- restore.mjs
- visit_details
- visit_details
- visit_list
- list-r2-lost-photos.mjs
- migrate.mjs
- VisitDetailModal
- webauthn/index.ts
- get-upload-url/index.ts
- 0007_webauthn.sql
- 0010_tl_role.sql
- tl_regions
- BengkelImportModal
- useTabBackButton
- admin-create-md/index.ts
- 0018_egress_log.sql
- vercel.json
- vite.config.js
- run-sql.mjs
- distributors
- profiles
- LINK-200-FOTO.md

## God Nodes (most connected - your core abstractions)
1. `persistMock()` - 19 edges
2. `Mobil1 POSM Tracker` - 12 edges
3. `profiles` - 11 edges
4. `monthLabel()` - 9 edges
5. `useBackDismiss()` - 9 edges
6. `mockAtt()` - 9 edges
7. `fmtAbsenTime()` - 7 edges
8. `AdminAbsenTab()` - 7 edges
9. `fetchAllPaged()` - 7 edges
10. `uploadAttendancePhoto()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Cloudflare R2 Storage` --semantically_similar_to--> `Backblaze B2 Photo Storage`  [INFERRED] [semantically similar]
  README.md → PRD.md
- `Presigned Upload Photo Flow` --semantically_similar_to--> `Edge Function get-upload-url (Presigned URL)`  [INFERRED] [semantically similar]
  README.md → PRD.md
- `Mobil1 POSM Tracker (README)` --conceptually_related_to--> `Mobil1 POSM Tracker`  [INFERRED]
  README.md → PRD.md
- `src/main.jsx (React Entry Script)` --calls--> `src/App.jsx (UI Components)`  [INFERRED]
  index.html → README.md
- `src/lib/supabase.js (Client + MOCK_MODE)` --references--> `Supabase (Postgres + Auth)`  [EXTRACTED]
  README.md → PRD.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Backup & Disaster Recovery Flow** — ops_backup_readme_backup_mjs, ops_backup_readme_restore_mjs, readme_setup_fresh_sql, readme_edge_admin_create_md [EXTRACTED 1.00]
- **Backup-before-migration pipeline** — _github_workflows_migrate_yml_migrate_job, _github_workflows_migrate_yml_ops_backup_backup_mjs, _github_workflows_migrate_yml_ops_migrate_mjs, _github_workflows_migrate_yml_backup_before_migration_rule [EXTRACTED 1.00]
- **Region-Kota-Bengkel-Visit Data Hierarchy** — prd_entity_regions, prd_entity_bengkels, prd_entity_distributors, prd_entity_visits [EXTRACTED 1.00]
- **Presigned Photo Upload Pipeline** — readme_lib_storage, prd_edge_function_get_upload_url, readme_s3_object_storage, prd_backblaze_b2 [EXTRACTED 1.00]

## Communities (58 total, 8 thin omitted)

### Community 0 - "_mock.js"
Cohesion: 0.07
Nodes (35): StoredImage(), checkIn(), checkOut(), deleteAttendance(), fetchAttendances(), fetchAttendancesByMonth(), fetchAttendancesByRange(), fetchTodayAttendance() (+27 more)

### Community 1 - "App UI Components"
Cohesion: 0.04
Nodes (24): RFC-4180, ALL_SUBTYPES, App(), BENGKEL_ICON, BLUE_PIN_ICON, COLUMN_ALIASES, EXPORT_PHOTO_HEADER, EXPORT_PHOTO_SKIP (+16 more)

### Community 2 - "Backup & Restore Docs"
Cohesion: 0.06
Nodes (37): Supabase Database Backup, backup.mjs Script, restore.mjs Script, Windows Scheduled Backup Task, service_role Key, Dashboard & Admin Report Module, Attendance (Absensi) Module, Authentication Module (+29 more)

### Community 3 - "Fresh Setup Schema"
Cohesion: 0.12
Nodes (21): public.handle_new_user, bengkels, bengkels_set_updated_at, distributors, get_user_region(), get_user_role(), kotas, md_monthly_performance (+13 more)

### Community 4 - "Seed Generator Scripts"
Cohesion: 0.08
Nodes (24): bengkelChunks, bengkels, bengkelsCsv, codeSeen, distributors, distributorsCsv, distSeen, ensureKota() (+16 more)

### Community 5 - "master.js"
Cohesion: 0.10
Nodes (33): fetchAllPaged(), addMaster(), bengkelCacheKey(), bulkAddBengkels(), bulkAddMaster(), bulkCreateMDs(), bustMasterCache(), cachedMaster() (+25 more)

### Community 6 - "package.json"
Cohesion: 0.09
Nodes (21): autoprefixer, devDependencies, autoprefixer, postcss, tailwindcss, vite, @vitejs/plugin-basic-ssl, @vitejs/plugin-react (+13 more)

### Community 7 - "dependencies"
Cohesion: 0.10
Nodes (21): browser-image-compression, leaflet, lucide-react, dependencies, browser-image-compression, leaflet, lucide-react, react (+13 more)

### Community 8 - "import-ardiansyah.mjs"
Cohesion: 0.11
Nodes (17): bad, cfg, codeMap, col(), colExact(), colUrl(), distMap, DO_INSERT (+9 more)

### Community 9 - "import-visits.mjs"
Cohesion: 0.12
Nodes (17): bad, cfg, codeMap, distMap, DO_INSERT, emailMap, existKeys, keyOf() (+9 more)

### Community 10 - "0001_schema.sql"
Cohesion: 0.22
Nodes (16): bengkels, bengkels_set_updated_at, distributors, get_user_role(), handle_new_user(), kotas, md_monthly_performance, on_auth_user_created (+8 more)

### Community 11 - "monthLabel"
Cohesion: 0.20
Nodes (15): AbsenHistory(), AdminAbsenTab(), CoverageTab(), DashboardTab(), excelDateSerial(), excelDateTimeSerial(), exportVisitsXlsx(), fmtAbsenTime() (+7 more)

### Community 12 - "laporan_visit"
Cohesion: 0.17
Nodes (13): attendance_details, attendances, attendances_set_updated_at, profiles, set_updated_at, laporan_absen, laporan_visit, bengkels (+5 more)

### Community 13 - "Backblaze B2 Photo Storage"
Cohesion: 0.18
Nodes (13): index.html (App Entry Point), src/main.jsx (React Entry Script), Backblaze B2 Photo Storage, Cloudflare CDN, Edge Function get-upload-url (Presigned URL), src/App.jsx (UI Components), Cloudflare R2 Storage, IndexedDB Mock Storage (+5 more)

### Community 14 - "measure.mjs"
Cohesion: 0.17
Nodes (8): cfg, __dirname, H, month, QUERIES, results, sizeMap, totalGz

### Community 15 - "useBackDismiss"
Cohesion: 0.21
Nodes (12): AbsenTab(), downloadMasterTemplate(), __ensureModalListener(), localDateStr(), __lockBodyScroll(), MasterImportModal(), MasterTab(), MDDashboard() (+4 more)

### Community 16 - "backup.mjs"
Cohesion: 0.20
Nodes (6): cfg, cfgPath, __dirname, logFile, supabase, TABLES

### Community 17 - "visit_details"
Cohesion: 0.28
Nodes (8): md_monthly_performance, bengkels, distributors, kotas, profiles, regions, visits, visit_details

### Community 18 - "visit_details"
Cohesion: 0.28
Nodes (8): md_monthly_performance, bengkels, distributors, kotas, profiles, regions, visits, visit_details

### Community 19 - "visit_details"
Cohesion: 0.28
Nodes (8): md_monthly_performance, bengkels, distributors, kotas, profiles, regions, visits, visit_details

### Community 20 - "ops/backup/backup.mjs"
Cohesion: 0.32
Nodes (8): Backup sebelum migrasi (aturan), ops/backup/backup.config.json, continue-on-error on backup step (temporary), migrate job, ops/backup/backup.mjs, ops/migrate.mjs, Supabase Migrations Workflow, Supabase production project mybrstcvmobourhzkrlp

### Community 21 - "restore.mjs"
Cohesion: 0.25
Nodes (7): cfg, CONFLICT, __dirname, dryRun, onlyArg, payload, supabase

### Community 22 - "visit_details"
Cohesion: 0.25
Nodes (7): bengkels, distributors, kotas, profiles, regions, visits, visit_details

### Community 23 - "visit_details"
Cohesion: 0.25
Nodes (7): bengkels, distributors, kotas, profiles, regions, visits, visit_details

### Community 24 - "visit_list"
Cohesion: 0.25
Nodes (7): bengkels, distributors, kotas, profiles, regions, visits, visit_list

### Community 25 - "list-r2-lost-photos.mjs"
Cohesion: 0.33
Nodes (5): all, byMd, h, T, win

### Community 26 - "migrate.mjs"
Cohesion: 0.33
Nodes (4): applied, BASELINE, files, NEVER_AUTO

### Community 27 - "VisitDetailModal"
Cohesion: 0.47
Nodes (6): BengkelMap(), formatDistance(), haversineMeters(), OnSiteBadge(), VisitDetailModal(), VisitForm()

### Community 28 - "webauthn/index.ts"
Cohesion: 0.40
Nodes (3): b64urlToBytes(), challengeFromResponse(), corsHeaders

### Community 29 - "get-upload-url/index.ts"
Cohesion: 0.40
Nodes (3): ALLOWED_CONTENT_TYPES, ALLOWED_PHOTO_KEYS, corsHeaders

### Community 30 - "0007_webauthn.sql"
Cohesion: 0.40
Nodes (3): profiles, webauthn_challenges, webauthn_credentials

### Community 31 - "0010_tl_role.sql"
Cohesion: 0.50
Nodes (3): get_user_region(), md_region(), profiles

### Community 32 - "tl_regions"
Cohesion: 0.40
Nodes (3): profiles, regions, tl_regions

### Community 33 - "BengkelImportModal"
Cohesion: 0.50
Nodes (4): BengkelImportModal(), downloadBengkelTemplate(), normalizeColumn(), validateBengkelRow()

### Community 34 - "useTabBackButton"
Cohesion: 0.67
Nodes (3): AdminView(), MDView(), useTabBackButton()

## Knowledge Gaps
- **158 isolated node(s):** `__dirname`, `cfgPath`, `cfg`, `logFile`, `supabase` (+153 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MOCK_MODE` connect `_mock.js` to `App UI Components`, `master.js`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `Supabase (Postgres + Auth)` connect `Backup & Restore Docs` to `Backblaze B2 Photo Storage`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **What connects `__dirname`, `cfgPath`, `cfg` to the rest of the system?**
  _158 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `_mock.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07127882599580712 - nodes in this community are weakly interconnected._
- **Should `App UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.03571428571428571 - nodes in this community are weakly interconnected._
- **Should `Backup & Restore Docs` be split into smaller, more focused modules?**
  _Cohesion score 0.06456456456456457 - nodes in this community are weakly interconnected._