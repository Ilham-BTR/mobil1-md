# Graph Report - Mobil1  (2026-10-17)

## Corpus Check
- 91 files · ~538,593 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1063 nodes · 1462 edges · 99 communities (85 shown, 14 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3bac30f2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- src/App.jsx
- auth.js
- master.js
- Fresh Setup Schema
- Seed Generator Scripts
- dependencies
- laporan_visit
- import-ardiansyah.mjs
- import-visits.mjs
- 0001_schema.sql
- monthLabel
- laporan_visit
- measure.mjs
- useBackDismiss
- backup.mjs Script
- local-perf-before-20261017-040900/App.jsx
- backup.mjs
- visit_details
- visit_details
- visit_details
- ops/backup/backup.mjs
- restore.mjs
- local-perf-before-20261017-032351/App.jsx
- visit_details
- visit_details
- visit_list
- src/lib/supabase.js (Client + MOCK_MODE)
- local-perf-before-20261017-033431/App.jsx
- list-r2-lost-photos.mjs
- migrate.mjs
- dependencies
- localDateStr
- webauthn/index.ts
- get-upload-url/index.ts
- 0007_webauthn.sql
- 0010_tl_role.sql
- tl_regions
- dependencies
- _mock.js
- admin-create-md/index.ts
- 0018_egress_log.sql
- vercel.json
- vite.config.js
- dependencies
- run-sql.mjs
- distributors
- profiles
- devDependencies
- devDependencies
- useBackDismiss
- useBackDismiss
- useBackDismiss
- attendance.js
- monthLabel
- monthLabel
- monthLabel
- src/lib/api/visits.js
- visitExport.js
- local-perf-before-20261017-032351/src/lib/api/visits.js
- local-perf-before-20261017-040900/src/lib/api/visits.js
- Mobil1 POSM Tracker
- Supabase (Postgres + Auth)
- kvCache.js
- visits (Core Entity)
- VisitDetailModal
- VisitDetailModal
- VisitDetailModal
- Backblaze B2 Photo Storage
- local-perf-before-20261017-040900/package.json
- scripts
- package.json
- scripts
- aggregateVisitsByMd
- CoverageViewport.jsx
- useTabBackButton
- useTabBackButton
- useTabBackButton
- react
- react-dom
- vitest
- react
- react-dom
- vitest

## God Nodes (most connected - your core abstractions)
1. `persistMock()` - 19 edges
2. `Mobil1 POSM Tracker` - 12 edges
3. `profiles` - 11 edges
4. `monthLabel()` - 9 edges
5. `useBackDismiss()` - 9 edges
6. `monthLabel()` - 9 edges
7. `useBackDismiss()` - 9 edges
8. `monthLabel()` - 9 edges
9. `useBackDismiss()` - 9 edges
10. `monthLabel()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Cloudflare R2 Storage` --semantically_similar_to--> `Backblaze B2 Photo Storage`  [INFERRED] [semantically similar]
  README.md → PRD.md
- `Presigned Upload Photo Flow` --semantically_similar_to--> `Edge Function get-upload-url (Presigned URL)`  [INFERRED] [semantically similar]
  README.md → PRD.md
- `Mobil1 POSM Tracker (README)` --conceptually_related_to--> `Mobil1 POSM Tracker`  [INFERRED]
  README.md → PRD.md
- `backup.mjs Script` --shares_data_with--> `visits (Core Entity)`  [EXTRACTED]
  ops/backup/README.md → PRD.md
- `backup.mjs Script` --references--> `Supabase (Postgres + Auth)`  [EXTRACTED]
  ops/backup/README.md → PRD.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Backup & Disaster Recovery Flow** — ops_backup_readme_backup_mjs, ops_backup_readme_restore_mjs, readme_setup_fresh_sql, readme_edge_admin_create_md [EXTRACTED 1.00]
- **Backup-before-migration pipeline** — _github_workflows_migrate_yml_migrate_job, _github_workflows_migrate_yml_ops_backup_backup_mjs, _github_workflows_migrate_yml_ops_migrate_mjs, _github_workflows_migrate_yml_backup_before_migration_rule [EXTRACTED 1.00]
- **Region-Kota-Bengkel-Visit Data Hierarchy** — prd_entity_regions, prd_entity_bengkels, prd_entity_distributors, prd_entity_visits [EXTRACTED 1.00]
- **Presigned Photo Upload Pipeline** — readme_lib_storage, prd_edge_function_get_upload_url, readme_s3_object_storage, prd_backblaze_b2 [EXTRACTED 1.00]

## Communities (99 total, 14 thin omitted)

### Community 0 - "src/App.jsx"
Cohesion: 0.04
Nodes (25): AdminView(), ALL_SUBTYPES, App(), BENGKEL_ICON, BLUE_PIN_ICON, COLUMN_ALIASES, EXPORT_PHOTO_HEADER, EXPORT_PHOTO_SKIP (+17 more)

### Community 1 - "auth.js"
Cohesion: 0.13
Nodes (7): MOCK_DATA, attachEgressMeter(), countCall(), counts, endpointLabel(), MOCK_MODE, supabase

### Community 2 - "master.js"
Cohesion: 0.21
Nodes (18): addMaster(), bulkAddBengkels(), bulkAddMaster(), bulkCreateMDs(), bustMasterCache(), cachedMaster(), deleteMaster(), deleteMd() (+10 more)

### Community 3 - "Fresh Setup Schema"
Cohesion: 0.12
Nodes (21): public.handle_new_user, bengkels, bengkels_set_updated_at, distributors, get_user_region(), get_user_role(), kotas, md_monthly_performance (+13 more)

### Community 4 - "Seed Generator Scripts"
Cohesion: 0.08
Nodes (24): bengkelChunks, bengkels, bengkelsCsv, codeSeen, distributors, distributorsCsv, distSeen, ensureKota() (+16 more)

### Community 5 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, browser-image-compression, leaflet, lucide-react, react-leaflet, recharts, @simplewebauthn/browser, @supabase/supabase-js (+9 more)

### Community 6 - "laporan_visit"
Cohesion: 0.47
Nodes (9): laporan_visit, bengkels, distributors, kotas, profiles, regions, visits, visit_details (+1 more)

### Community 7 - "import-ardiansyah.mjs"
Cohesion: 0.11
Nodes (17): bad, cfg, codeMap, col(), colExact(), colUrl(), distMap, DO_INSERT (+9 more)

### Community 8 - "import-visits.mjs"
Cohesion: 0.11
Nodes (18): bad, cfg, codeMap, distMap, DO_INSERT, emailMap, existKeys, keyOf() (+10 more)

### Community 9 - "0001_schema.sql"
Cohesion: 0.22
Nodes (16): bengkels, bengkels_set_updated_at, distributors, get_user_role(), handle_new_user(), kotas, md_monthly_performance, on_auth_user_created (+8 more)

### Community 10 - "monthLabel"
Cohesion: 0.29
Nodes (10): AbsenHistory(), AdminAbsenTab(), CoverageTab(), DashboardTab(), fmtAbsenTime(), fmtWorkDuration(), monthLabel(), setColDateFormat() (+2 more)

### Community 11 - "laporan_visit"
Cohesion: 0.17
Nodes (13): attendance_details, attendances, attendances_set_updated_at, profiles, set_updated_at, laporan_absen, laporan_visit, bengkels (+5 more)

### Community 12 - "measure.mjs"
Cohesion: 0.17
Nodes (8): cfg, __dirname, H, month, QUERIES, results, sizeMap, totalGz

### Community 13 - "useBackDismiss"
Cohesion: 0.18
Nodes (13): BengkelImportModal(), downloadBengkelTemplate(), downloadMasterTemplate(), __ensureModalListener(), __lockBodyScroll(), MasterImportModal(), MasterTab(), MdDetailModal() (+5 more)

### Community 14 - "backup.mjs Script"
Cohesion: 0.22
Nodes (11): Supabase Database Backup, backup.mjs Script, restore.mjs Script, Windows Scheduled Backup Task, service_role Key, profiles Entity, MD (Merchandiser) Role, Row Level Security (RLS) (+3 more)

### Community 15 - "local-perf-before-20261017-040900/App.jsx"
Cohesion: 0.03
Nodes (23): ALL_SUBTYPES, BENGKEL_ICON, BLUE_PIN_ICON, COLUMN_ALIASES, EXPORT_PHOTO_HEADER, EXPORT_PHOTO_SKIP, ID_MONTHS, INDONESIA_CENTER (+15 more)

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

### Community 22 - "local-perf-before-20261017-032351/App.jsx"
Cohesion: 0.04
Nodes (23): ALL_SUBTYPES, BENGKEL_ICON, BLUE_PIN_ICON, COLUMN_ALIASES, EXPORT_PHOTO_HEADER, EXPORT_PHOTO_SKIP, ID_MONTHS, INDONESIA_CENTER (+15 more)

### Community 23 - "visit_details"
Cohesion: 0.25
Nodes (7): bengkels, distributors, kotas, profiles, regions, visits, visit_details

### Community 24 - "visit_details"
Cohesion: 0.25
Nodes (7): bengkels, distributors, kotas, profiles, regions, visits, visit_details

### Community 25 - "visit_list"
Cohesion: 0.25
Nodes (7): bengkels, distributors, kotas, profiles, regions, visits, visit_list

### Community 26 - "src/lib/supabase.js (Client + MOCK_MODE)"
Cohesion: 0.29
Nodes (7): index.html (App Entry Point), src/main.jsx (React Entry Script), src/App.jsx (UI Components), IndexedDB Mock Storage, src/lib/api.js (Data Access Layer), src/lib/storage.js (Photo Upload), src/lib/supabase.js (Client + MOCK_MODE)

### Community 27 - "local-perf-before-20261017-033431/App.jsx"
Cohesion: 0.04
Nodes (23): ALL_SUBTYPES, BENGKEL_ICON, BLUE_PIN_ICON, COLUMN_ALIASES, EXPORT_PHOTO_HEADER, EXPORT_PHOTO_SKIP, ID_MONTHS, INDONESIA_CENTER (+15 more)

### Community 28 - "list-r2-lost-photos.mjs"
Cohesion: 0.33
Nodes (5): all, byMd, h, T, win

### Community 29 - "migrate.mjs"
Cohesion: 0.33
Nodes (4): applied, BASELINE, files, NEVER_AUTO

### Community 30 - "dependencies"
Cohesion: 0.05
Nodes (42): dependencies, browser-image-compression, leaflet, lucide-react, react, react-dom, react-leaflet, recharts (+34 more)

### Community 31 - "localDateStr"
Cohesion: 0.28
Nodes (9): AbsenTab(), BengkelMap(), formatDistance(), haversineMeters(), localDateStr(), MDDashboard(), OnSiteBadge(), VisitDetailModal() (+1 more)

### Community 32 - "webauthn/index.ts"
Cohesion: 0.40
Nodes (3): b64urlToBytes(), challengeFromResponse(), corsHeaders

### Community 33 - "get-upload-url/index.ts"
Cohesion: 0.40
Nodes (3): ALLOWED_CONTENT_TYPES, ALLOWED_PHOTO_KEYS, corsHeaders

### Community 34 - "0007_webauthn.sql"
Cohesion: 0.40
Nodes (3): profiles, webauthn_challenges, webauthn_credentials

### Community 35 - "0010_tl_role.sql"
Cohesion: 0.50
Nodes (3): get_user_region(), md_region(), profiles

### Community 36 - "tl_regions"
Cohesion: 0.40
Nodes (3): profiles, regions, tl_regions

### Community 37 - "dependencies"
Cohesion: 0.05
Nodes (42): dependencies, browser-image-compression, leaflet, lucide-react, react, react-dom, react-leaflet, recharts (+34 more)

### Community 38 - "_mock.js"
Cohesion: 0.18
Nodes (14): StoredImage(), DEFAULT_MOCK, resetMockData(), deleteVisit(), clearPhotos(), deletePhotosByVisit(), getPhotoBlob(), getPhotoURL() (+6 more)

### Community 44 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, browser-image-compression, leaflet, lucide-react, react-leaflet, recharts, @simplewebauthn/browser, @supabase/supabase-js (+9 more)

### Community 62 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, autoprefixer, jsdom, postcss, react-test-renderer, tailwindcss, vite, @vitejs/plugin-basic-ssl (+9 more)

### Community 63 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, autoprefixer, jsdom, postcss, react-test-renderer, tailwindcss, vite, @vitejs/plugin-basic-ssl (+9 more)

### Community 64 - "useBackDismiss"
Cohesion: 0.15
Nodes (16): AbsenTab(), BengkelImportModal(), downloadBengkelTemplate(), downloadMasterTemplate(), __ensureModalListener(), localDateStr(), __lockBodyScroll(), MasterImportModal() (+8 more)

### Community 65 - "useBackDismiss"
Cohesion: 0.15
Nodes (16): AbsenTab(), BengkelImportModal(), downloadBengkelTemplate(), downloadMasterTemplate(), __ensureModalListener(), localDateStr(), __lockBodyScroll(), MasterImportModal() (+8 more)

### Community 66 - "useBackDismiss"
Cohesion: 0.15
Nodes (16): AbsenTab(), BengkelImportModal(), downloadBengkelTemplate(), downloadMasterTemplate(), __ensureModalListener(), localDateStr(), __lockBodyScroll(), MasterImportModal() (+8 more)

### Community 67 - "attendance.js"
Cohesion: 0.28
Nodes (13): checkIn(), checkOut(), deleteAttendance(), fetchAttendances(), fetchAttendancesByMonth(), fetchAttendancesByRange(), fetchTodayAttendance(), mockAtt() (+5 more)

### Community 68 - "monthLabel"
Cohesion: 0.20
Nodes (15): AbsenHistory(), AdminAbsenTab(), CoverageTab(), DashboardTab(), excelDateSerial(), excelDateTimeSerial(), exportVisitsXlsx(), fmtAbsenTime() (+7 more)

### Community 69 - "monthLabel"
Cohesion: 0.20
Nodes (15): AbsenHistory(), AdminAbsenTab(), CoverageTab(), DashboardTab(), excelDateSerial(), excelDateTimeSerial(), exportVisitsXlsx(), fmtAbsenTime() (+7 more)

### Community 70 - "monthLabel"
Cohesion: 0.20
Nodes (15): AbsenHistory(), AdminAbsenTab(), CoverageTab(), DashboardTab(), excelDateSerial(), excelDateTimeSerial(), exportVisitsXlsx(), fmtAbsenTime() (+7 more)

### Community 71 - "src/lib/api/visits.js"
Cohesion: 0.25
Nodes (10): fetchAllPaged(), fetchPagedProgressively(), countPhotos(), createVisit(), fetchVisitFull(), fetchVisits(), fetchVisitsDelta(), fetchVisitsProgressive() (+2 more)

### Community 72 - "visitExport.js"
Cohesion: 0.22
Nodes (11): excelDateSerial(), XL_EPOCH, VISIT_PHOTO_MAP, excelDateTimeSerial(), EXPORT_PHOTO_HEADER, EXPORT_PHOTO_SKIP, exportVisitsXlsx(), PHOTO_KEYS (+3 more)

### Community 73 - "local-perf-before-20261017-032351/src/lib/api/visits.js"
Cohesion: 0.29
Nodes (6): fetchAllPaged(), countPhotos(), fetchVisitFull(), fetchVisits(), fetchVisitsDelta(), VISIT_PHOTO_COLS

### Community 74 - "local-perf-before-20261017-040900/src/lib/api/visits.js"
Cohesion: 0.29
Nodes (6): fetchAllPaged(), countPhotos(), fetchVisitFull(), fetchVisits(), fetchVisitsDelta(), VISIT_PHOTO_COLS

### Community 75 - "Mobil1 POSM Tracker"
Cohesion: 0.18
Nodes (11): Dashboard & Admin Report Module, Attendance (Absensi) Module, attendances Entity, Master Data Management Module, Mobil1 POSM Tracker, React Native/Expo Native Port, POSM (Point of Sale Materials), Admin Role (+3 more)

### Community 76 - "Supabase (Postgres + Auth)"
Cohesion: 0.25
Nodes (8): Authentication Module, Demo Mode (Mock Data), Excel (.xlsx) Export, Leaflet / react-leaflet Maps, Passkey/WebAuthn Login, React 18 + Vite 5 + Tailwind Frontend, Supabase (Postgres + Auth), Edge Function webauthn

### Community 77 - "kvCache.js"
Cohesion: 0.36
Nodes (7): bengkelCacheKey(), fetchBengkels(), fetchBengkelsCached(), kvDel(), kvGet(), kvSet(), openKv()

### Community 78 - "visits (Core Entity)"
Cohesion: 0.29
Nodes (7): bengkels (Workshops) Entity, distributors Entity, regions/kotas Hierarchy, visits (Core Entity), Automatic GPS Capture, Browser Photo Compression, Visit Reporting Module

### Community 79 - "VisitDetailModal"
Cohesion: 0.47
Nodes (6): BengkelMap(), formatDistance(), haversineMeters(), OnSiteBadge(), VisitDetailModal(), VisitForm()

### Community 80 - "VisitDetailModal"
Cohesion: 0.47
Nodes (6): BengkelMap(), formatDistance(), haversineMeters(), OnSiteBadge(), VisitDetailModal(), VisitForm()

### Community 81 - "VisitDetailModal"
Cohesion: 0.47
Nodes (6): BengkelMap(), formatDistance(), haversineMeters(), OnSiteBadge(), VisitDetailModal(), VisitForm()

### Community 82 - "Backblaze B2 Photo Storage"
Cohesion: 0.47
Nodes (6): Backblaze B2 Photo Storage, Cloudflare CDN, Edge Function get-upload-url (Presigned URL), Cloudflare R2 Storage, Presigned Upload Photo Flow, S3-Compatible Object Storage

### Community 83 - "local-perf-before-20261017-040900/package.json"
Cohesion: 0.40
Nodes (4): name, private, type, version

### Community 84 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, test

### Community 85 - "package.json"
Cohesion: 0.40
Nodes (4): name, private, type, version

### Community 86 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, test

### Community 87 - "aggregateVisitsByMd"
Cohesion: 0.60
Nodes (3): LeaderboardTab(), aggregateVisitsByMd(), aggregateVisitTotals()

### Community 89 - "useTabBackButton"
Cohesion: 0.67
Nodes (3): AdminView(), MDView(), useTabBackButton()

### Community 90 - "useTabBackButton"
Cohesion: 0.67
Nodes (3): AdminView(), MDView(), useTabBackButton()

### Community 91 - "useTabBackButton"
Cohesion: 0.67
Nodes (3): AdminView(), MDView(), useTabBackButton()

## Knowledge Gaps
- **310 isolated node(s):** `__dirname`, `cfgPath`, `cfg`, `logFile`, `supabase` (+305 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MOCK_MODE` connect `auth.js` to `src/App.jsx`, `master.js`, `attendance.js`, `src/lib/api/visits.js`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `local-perf-before-20261017-040900/package.json`, `vitest`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `react`, `react-dom`, `package.json`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `__dirname`, `cfgPath`, `cfg` to the rest of the system?**
  _310 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `src/App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.03696741854636591 - nodes in this community are weakly interconnected._
- **Should `auth.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13450292397660818 - nodes in this community are weakly interconnected._
- **Should `Fresh Setup Schema` be split into smaller, more focused modules?**
  _Cohesion score 0.11954022988505747 - nodes in this community are weakly interconnected._