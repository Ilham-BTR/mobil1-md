# Graph Report - Mobil1  (2026-10-17)

## Corpus Check
- 109 files · ~764,277 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2346 nodes · 4051 edges · 169 communities (151 shown, 18 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 259 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ab1dca1e`
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
- BengkelImportModal
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
- src/lib/visitExport.js
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
- DashboardTab
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
- export-fix-before-20261017-072435/App.jsx
- export-fix-before-20261017-072435/src/lib/visitExport.js
- monthLabel
- localDateStr
- export-fix-before-20261017-072435/visitExport.js
- VisitDetailModal
- useBackDismiss
- useTabBackButton
- .test.js
- export-and-filter-before-20261017-093300/App.jsx
- createSuiteCollector
- diff
- match
- withGlobal
- format
- inspect
- assert
- inspectList2
- iterableEquality
- "node_modules/@supabase/auth-js/dist/main/lib/webauthn.js"
- requireLib
- createExpect
- sort
- "node_modules/tslib/tslib.es6.mjs"
- handleOperation
- requireReactIs_development
- flag
- extensiveDeepEqualByType
- "node_modules/@supabase/auth-js/dist/main/lib/helpers.js"
- constructor
- indexOf
- saveInlineSnapshots
- C2
- __importDefault
- parseUrl
- inspect22
- step
- then
- monthLabel
- align
- toString
- reject
- loadShould
- assertThrows
- formatTitle
- "node_modules/@supabase/auth-js/dist/main/lib/base64url.js"
- localDateStr
- export-and-filter-before-20261017-093300/src/lib/visitExport.js
- cloneRequestState
- waitFor
- joinAlignedDiffsNoExpand
- namespaceToPath2
- "node_modules/@supabase/auth-js/dist/main/lib/errors.js"
- _getFinalPath
- "node_modules/@supabase/auth-js/dist/main/lib/web3/ethereum.js"
- uploadOrUpdate
- VisitDetailModal
- useBackDismiss
- VisitDetailModal
- _objectSpread2
- extractTraceContext
- "node_modules/@supabase/realtime-js/dist/main/phoenix/presenceAdapter.js"
- getSnapshotState
- toPropertyKey2
- use
- "node_modules/magic-string/dist/magic-string.es.mjs"
- "node_modules/@supabase/auth-js/dist/main/lib/webauthn.errors.js"
- useTabBackButton
- "node_modules/expect-type/dist/index.js"
- "node_modules/@supabase/auth-js/dist/main/lib/local-storage.js"

## God Nodes (most connected - your core abstractions)
1. `toString()` - 43 edges
2. `assert()` - 38 edges
3. `match()` - 33 edges
4. `"node_modules/tslib/tslib.es6.mjs"()` - 31 edges
5. `withGlobal()` - 31 edges
6. `handleOperation()` - 28 edges
7. `constructor()` - 24 edges
8. `then()` - 24 edges
9. `indexOf()` - 23 edges
10. `createClock()` - 22 edges

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

## Communities (169 total, 18 thin omitted)

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
Nodes (10): AbsenHistory(), AdminAbsenTab(), CoverageTab(), fmtAbsenTime(), fmtWorkDuration(), LeaderboardTab(), monthLabel(), setColDateFormat() (+2 more)

### Community 11 - "laporan_visit"
Cohesion: 0.17
Nodes (13): attendance_details, attendances, attendances_set_updated_at, profiles, set_updated_at, laporan_absen, laporan_visit, bengkels (+5 more)

### Community 12 - "measure.mjs"
Cohesion: 0.17
Nodes (8): cfg, __dirname, H, month, QUERIES, results, sizeMap, totalGz

### Community 13 - "useBackDismiss"
Cohesion: 0.21
Nodes (12): AbsenTab(), downloadMasterTemplate(), __ensureModalListener(), localDateStr(), __lockBodyScroll(), MasterImportModal(), MasterTab(), MDDashboard() (+4 more)

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

### Community 31 - "BengkelImportModal"
Cohesion: 0.50
Nodes (4): BengkelImportModal(), downloadBengkelTemplate(), normalizeColumn(), validateBengkelRow()

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

### Community 72 - "src/lib/visitExport.js"
Cohesion: 0.19
Nodes (12): excelDateSerial(), XL_EPOCH, VISIT_PHOTO_MAP, excelDateTimeSerial(), EXPORT_PHOTO_HEADER, EXPORT_PHOTO_SKIP, exportVisitsXlsx(), PHOTO_COLUMNS (+4 more)

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

### Community 87 - "DashboardTab"
Cohesion: 0.36
Nodes (4): DashboardTab(), currentMonthKey(), aggregateVisitsByMd(), aggregateVisitTotals()

### Community 89 - "useTabBackButton"
Cohesion: 0.67
Nodes (3): AdminView(), MDView(), useTabBackButton()

### Community 90 - "useTabBackButton"
Cohesion: 0.67
Nodes (3): AdminView(), MDView(), useTabBackButton()

### Community 91 - "useTabBackButton"
Cohesion: 0.67
Nodes (3): AdminView(), MDView(), useTabBackButton()

### Community 99 - "export-fix-before-20261017-072435/App.jsx"
Cohesion: 0.04
Nodes (21): ALL_SUBTYPES, BENGKEL_ICON, BLUE_PIN_ICON, COLUMN_ALIASES, EXPORT_PHOTO_HEADER, EXPORT_PHOTO_SKIP, ID_MONTHS, INDONESIA_CENTER (+13 more)

### Community 100 - "export-fix-before-20261017-072435/src/lib/visitExport.js"
Cohesion: 0.08
Nodes (33): DEFAULT_MOCK, MOCK_DATA, persistMock(), resetMockData(), attachEgressMeter(), countCall(), counts, endpointLabel() (+25 more)

### Community 101 - "monthLabel"
Cohesion: 0.24
Nodes (12): AbsenHistory(), AdminAbsenTab(), CoverageTab(), DashboardTab(), fmtAbsenTime(), fmtWorkDuration(), LeaderboardTab(), monthLabel() (+4 more)

### Community 102 - "localDateStr"
Cohesion: 0.20
Nodes (10): AbsenTab(), BengkelImportModal(), downloadBengkelTemplate(), downloadMasterTemplate(), localDateStr(), MasterImportModal(), MasterTab(), MDDashboard() (+2 more)

### Community 103 - "export-fix-before-20261017-072435/visitExport.js"
Cohesion: 0.29
Nodes (8): excelDateTimeSerial(), EXPORT_PHOTO_HEADER, EXPORT_PHOTO_SKIP, exportVisitsXlsx(), PHOTO_KEYS, setColDateFormat(), visitToCSVRow(), XL_EPOCH

### Community 104 - "VisitDetailModal"
Cohesion: 0.47
Nodes (6): BengkelMap(), formatDistance(), haversineMeters(), OnSiteBadge(), VisitDetailModal(), VisitForm()

### Community 105 - "useBackDismiss"
Cohesion: 0.40
Nodes (6): __ensureModalListener(), __lockBodyScroll(), MdDetailModal(), MDWelcomeModal(), PasskeyManagerModal(), useBackDismiss()

### Community 106 - "useTabBackButton"
Cohesion: 0.67
Nodes (3): AdminView(), MDView(), useTabBackButton()

### Community 107 - ".test.js"
Cohesion: 0.01
Nodes (48): RFC-6749, advanceTimersByTimeAsync(), advanceTimersToNextFrame(), advanceTimersToNextTimer(), advanceTimersToNextTimerAsync(), _checkFakeTimers(), createNamespace(), createNamespaceIfNotExists() (+40 more)

### Community 108 - "export-and-filter-before-20261017-093300/App.jsx"
Cohesion: 0.04
Nodes (21): ALL_SUBTYPES, BENGKEL_ICON, BLUE_PIN_ICON, COLUMN_ALIASES, EXPORT_PHOTO_HEADER, EXPORT_PHOTO_SKIP, ID_MONTHS, INDONESIA_CENTER (+13 more)

### Community 109 - "createSuiteCollector"
Cohesion: 0.06
Nodes (40): assert2(), attachEgressMeter(), clear(), collectTask(), createBucket(), createChainable(), createSuite(), suiteFn() (+32 more)

### Community 110 - "diff"
Cohesion: 0.09
Nodes (39): compareObjects(), comparePrimitive(), countChanges(), diff(), diffLinesRaw(), diffLinesUnified(), diffLinesUnified2(), diffStrings() (+31 more)

### Community 111 - "match"
Cohesion: 0.06
Nodes (37): addExtraLineBreaks(), _addSnapshot(), countCall(), createSimpleStackTrace(), diff_cleanupSemanticLossless(), diff_cleanupSemanticScore_(), endpointLabel(), ensureTrailingSlash() (+29 more)

### Community 112 - "withGlobal"
Cohesion: 0.13
Nodes (32): withGlobal(), addTimer(), callTimer(), checkIsNearInfiniteLimit(), clearTimer(), compareTimers(), createClock(), doRun() (+24 more)

### Community 113 - "format"
Cohesion: 0.08
Nodes (32): createIndent(), findPlugin(), format(), getColorsEmpty(), getColorsHighlight(), getConfig(), getEscapeRegex(), getEscapeString() (+24 more)

### Community 114 - "inspect"
Cohesion: 0.09
Nodes (31): arrayFromSet(), assertIsMock(), escape(), getSpy(), inspect(), inspectArguments(), inspectArray(), inspectAttribute() (+23 more)

### Community 115 - "assert"
Cohesion: 0.09
Nodes (29): a(), assert(), assertAbove(), assertBelow(), assertChanges(), assertDecreases(), assertDelta(), assertEql() (+21 more)

### Community 116 - "inspectList2"
Cohesion: 0.09
Nodes (28): arrayFromSet2(), escape2(), inspect3(), inspectArguments2(), inspectArray2(), inspectAttribute2(), inspectBigInt2(), inspectClass2() (+20 more)

### Community 117 - "iterableEquality"
Cohesion: 0.12
Nodes (27): asymmetricMatch(), eq(), equals(), getCustomEqualityTesters(), getMatcherContext(), getMatcherState(), getObjectKeys(), getObjectSubset() (+19 more)

### Community 118 - ""node_modules/@supabase/auth-js/dist/main/lib/webauthn.js""
Cohesion: 0.09
Nodes (22): create(), inspectDate(), inspectDate2(), "node_modules/@supabase/auth-js/dist/main/lib/fetch.js"(), _generateLinkResponse(), handleError2(), _handleRequest2(), hasSession() (+14 more)

### Community 119 - "requireLib"
Cohesion: 0.10
Nodes (25): require_function(), requireArray(), requireCalledInOrder(), checkAdjacentCalls(), hasCallsLeft(), requireClassName(), requireCopyPrototypeMethods(), requireEvery() (+17 more)

### Community 120 - "createExpect"
Cohesion: 0.09
Nodes (26): addCustomEqualityTesters(), assertTypes(), clone(), collectOwnProperties(), createExpect(), assertions(), hasAssertions(), createExpectPoll() (+18 more)

### Community 121 - "sort"
Cohesion: 0.09
Nodes (23): binarySearch(), cast(), decode(), decodedMappings(), decodeInteger(), expectTypes(), getPropKeys(), getPropKeys$1() (+15 more)

### Community 122 - ""node_modules/tslib/tslib.es6.mjs""
Cohesion: 0.10
Nodes (21): __addDisposableResource(), __asyncDelegator(), verb(), __await(), __classPrivateFieldGet(), __classPrivateFieldIn(), __classPrivateFieldSet(), __decorate() (+13 more)

### Community 123 - "handleOperation"
Cohesion: 0.14
Nodes (21): copy(), createIndex(), deleteBucket(), deleteIndex(), deleteVectors(), emptyBucket(), getBucket(), getIndex() (+13 more)

### Community 124 - "requireReactIs_development"
Cohesion: 0.17
Nodes (16): getType(), requireReactIs(), requireReactIs_development(), isContextConsumer(), isContextProvider(), isForwardRef(), isFragment(), isLazy() (+8 more)

### Community 125 - "flag"
Cohesion: 0.17
Nodes (20): addChainableMethod(), addLengthGuard(), addMethod(), addProperty(), createAssertionMessage(), createAssertionMessage2(), def(), flag() (+12 more)

### Community 126 - "extensiveDeepEqualByType"
Cohesion: 0.16
Nodes (20): deepEqual(), entriesEqual(), extensiveDeepEqual(), extensiveDeepEqualByType(), generatorEqual(), getEnumerableKeys(), getEnumerableSymbols(), getGeneratorEntries() (+12 more)

### Community 127 - ""node_modules/@supabase/auth-js/dist/main/lib/helpers.js""
Cohesion: 0.13
Nodes (11): __esDecorate(), accept(), "node_modules/@supabase/auth-js/dist/main/lib/helpers.js"(), dec2hex(), generatePKCEChallenge(), generatePKCEVerifier(), getCodeChallengeAndMethod(), insecureUserWarningProxy() (+3 more)

### Community 128 - "constructor"
Cohesion: 0.13
Nodes (19): applySettingDefaults(), constructor(), createFetchClient(), _defineProperty3(), from(), getSnapshotData(), _handleTokenChanged(), _initRealtimeClient() (+11 more)

### Community 129 - "indexOf"
Cohesion: 0.12
Nodes (18): an(), C(), C3(), finally(), getOperator(), getProperties(), addProperty2(), indexOf() (+10 more)

### Community 130 - "saveInlineSnapshots"
Cohesion: 0.13
Nodes (18): escapeBacktickString(), getCallLastIndex2(), getCodeStartingAtIndex(), getObjectShapeEndIndex(), getUncheckedCount(), getUncheckedKeys(), offsetToLineNumber(), pack() (+10 more)

### Community 131 - "C2"
Cohesion: 0.23
Nodes (14): C2(), createVitest(), d(), enhanceSpy(), mockCall(), withImplementation(), f2(), fn() (+6 more)

### Community 132 - "__importDefault"
Cohesion: 0.16
Nodes (13): __exportStar(), __importDefault(), __importStar(), "node_modules/@supabase/auth-js/dist/main/AuthAdminApi.js"(), "node_modules/@supabase/auth-js/dist/main/AuthClient.js"(), "node_modules/@supabase/auth-js/dist/main/GoTrueClient.js"(), "node_modules/@supabase/auth-js/dist/main/index.js"(), "node_modules/@supabase/realtime-js/dist/main/index.js"() (+5 more)

### Community 133 - "parseUrl"
Cohesion: 0.18
Nodes (14): isAbsolutePath(), isAbsoluteUrl(), isFileUrl(), isRelative(), isSchemeRelativeUrl(), makeUrl(), mergePaths(), normalizePath() (+6 more)

### Community 134 - "inspect22"
Cohesion: 0.18
Nodes (13): assertKeys(), assertOwnPropertyDescriptor(), assertProperty(), compareByInspect(), getOwnEnumerableProperties(), getOwnEnumerablePropertySymbols(), getPathInfo(), getPrototype() (+5 more)

### Community 135 - "step"
Cohesion: 0.26
Nodes (11): __awaiter(), __awaiter2(), adopt(), fulfilled(), rejected(), step(), fulfilled(), rejected() (+3 more)

### Community 136 - "then"
Cohesion: 0.18
Nodes (12): catch(), createFetchApi(), execute(), getPromise(), _handleRequest(), "node_modules/@supabase/auth-js/dist/main/lib/locks.js"(), navigatorLock(), processLock() (+4 more)

### Community 137 - "monthLabel"
Cohesion: 0.24
Nodes (12): AbsenHistory(), AdminAbsenTab(), CoverageTab(), DashboardTab(), fmtAbsenTime(), fmtWorkDuration(), LeaderboardTab(), monthLabel() (+4 more)

### Community 138 - "align"
Cohesion: 0.20
Nodes (12): align(), concatenateRelevantDiffs(), flushChangeLines(), getAlignedDiffs(), getLines(), isLineEmpty(), moveLinesTo(), pushDiff() (+4 more)

### Community 139 - "toString"
Cohesion: 0.21
Nodes (12): applyTransformOptsToQuery(), buildUrl(), createSignedUrls(), download(), getPublicUrl(), inspectSymbol(), inspectSymbol2(), listBucketOptionsToQueryString() (+4 more)

### Community 140 - "reject"
Cohesion: 0.32
Nodes (12): __asyncGenerator(), awaitReturn(), fulfill(), reject(), resume(), settle(), step(), verb() (+4 more)

### Community 141 - "loadShould"
Cohesion: 0.20
Nodes (5): __disposeResources(), next(), loadShould(), should2, next()

### Community 142 - "assertThrows"
Cohesion: 0.20
Nodes (11): assertThrows(), compatibleConstructor(), compatibleInstance(), compatibleMessage(), getConstructorName(), getConstructorName2(), getMessage(), include() (+3 more)

### Community 143 - "formatTitle"
Cohesion: 0.20
Nodes (11): format2(), formatTitle(), getUnserializableMessage(), inspect2(), isImmutable(), isNegativeNaN(), normalizeErrorMessage(), objDisplay() (+3 more)

### Community 144 - ""node_modules/@supabase/auth-js/dist/main/lib/base64url.js""
Cohesion: 0.33
Nodes (11): "node_modules/@supabase/auth-js/dist/main/lib/base64url.js"(), base64UrlToUint8Array(), byteFromBase64URL(), bytesToBase64URL(), byteToBase64URL(), codepointToUTF8(), stringFromBase64URL(), stringFromUTF8() (+3 more)

### Community 145 - "localDateStr"
Cohesion: 0.20
Nodes (10): AbsenTab(), BengkelImportModal(), downloadBengkelTemplate(), downloadMasterTemplate(), localDateStr(), MasterImportModal(), MasterTab(), MDDashboard() (+2 more)

### Community 146 - "export-and-filter-before-20261017-093300/src/lib/visitExport.js"
Cohesion: 0.29
Nodes (8): excelDateTimeSerial(), EXPORT_PHOTO_HEADER, EXPORT_PHOTO_SKIP, exportVisitsXlsx(), PHOTO_COLUMNS, setColDateFormat(), visitToCSVRow(), XL_EPOCH

### Community 147 - "cloneRequestState"
Cohesion: 0.22
Nodes (9): cloneRequestState(), createDefer(), delete(), insert(), resolveFixtureFunction(), select(), update(), upsert() (+1 more)

### Community 148 - "waitFor"
Cohesion: 0.36
Nodes (8): advanceTimersByTime(), copyStackTrace(), getSafeTimers(), isFakeTimers(), makeTimeoutMsg(), waitFor(), waitUntil(), withTimeout()

### Community 149 - "joinAlignedDiffsNoExpand"
Cohesion: 0.39
Nodes (8): createPatchMark(), formatTrailingSpaces(), joinAlignedDiffsExpand(), joinAlignedDiffsNoExpand(), printCommonLine(), printDeleteLine(), printDiffLine(), printInsertLine()

### Community 150 - "namespaceToPath2"
Cohesion: 0.29
Nodes (8): createTable(), createTableIfNotExists(), dropTable(), listTables(), loadTable(), namespaceToPath2(), tableExists(), updateTable()

### Community 151 - ""node_modules/@supabase/auth-js/dist/main/lib/errors.js""
Cohesion: 0.46
Nodes (8): "node_modules/@supabase/auth-js/dist/main/lib/errors.js"(), isAuthApiError(), isAuthError(), isAuthImplicitGrantRedirectError(), isAuthPKCECodeVerifierMissingError(), isAuthRetryableFetchError(), isAuthSessionMissingError(), isAuthWeakPasswordError()

### Community 152 - "_getFinalPath"
Cohesion: 0.29
Nodes (7): createSignedUploadUrl(), createSignedUrl(), exists(), _getFinalPath(), info(), isStorageError(), requireDeprecated()

### Community 153 - ""node_modules/@supabase/auth-js/dist/main/lib/web3/ethereum.js""
Cohesion: 0.33
Nodes (6): encode(), encodeInteger(), "node_modules/@supabase/auth-js/dist/main/lib/web3/ethereum.js"(), createSiweMessage(), getAddress(), toHex()

### Community 154 - "uploadOrUpdate"
Cohesion: 0.43
Nodes (7): encodeMetadata(), _removeEmptyFolders(), setHeader(), toBase64(), upload(), uploadOrUpdate(), uploadToSignedUrl()

### Community 155 - "VisitDetailModal"
Cohesion: 0.47
Nodes (6): BengkelMap(), formatDistance(), haversineMeters(), OnSiteBadge(), VisitDetailModal(), VisitForm()

### Community 156 - "useBackDismiss"
Cohesion: 0.40
Nodes (6): __ensureModalListener(), __lockBodyScroll(), MdDetailModal(), MDWelcomeModal(), PasskeyManagerModal(), useBackDismiss()

### Community 157 - "VisitDetailModal"
Cohesion: 0.47
Nodes (6): BengkelMap(), formatDistance(), haversineMeters(), OnSiteBadge(), VisitDetailModal(), VisitForm()

### Community 158 - "_objectSpread2"
Cohesion: 0.40
Nodes (6): _defineProperty(), _objectSpread2(), ownKeys2(), toPrimitive(), toPropertyKey(), _typeof()

### Community 159 - "extractTraceContext"
Cohesion: 0.33
Nodes (6): extractTraceContext(), getTraceHeaders(), loadOtel(), matchStringTarget(), parseTraceParent(), shouldPropagateToTarget()

### Community 160 - ""node_modules/@supabase/realtime-js/dist/main/phoenix/presenceAdapter.js""
Cohesion: 0.50
Nodes (3): "node_modules/@supabase/realtime-js/dist/main/phoenix/presenceAdapter.js"(), parseCurrentPresences(), transformState()

### Community 161 - "getSnapshotState"
Cohesion: 0.50
Nodes (4): assertRaw(), finishCurrentRun(), getSnapshotState(), startCurrentRun()

### Community 162 - "toPropertyKey2"
Cohesion: 0.67
Nodes (4): _defineProperty2(), toPrimitive2(), toPropertyKey2(), _typeof2()

### Community 163 - "use"
Cohesion: 0.50
Nodes (3): expect(), requireChaiSubset(), use()

### Community 166 - "useTabBackButton"
Cohesion: 0.67
Nodes (3): AdminView(), MDView(), useTabBackButton()

## Knowledge Gaps
- **371 isolated node(s):** `RFC-6749`, `__dirname`, `cfgPath`, `cfg`, `logFile` (+366 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `"node_modules/@supabase/auth-js/dist/main/lib/helpers.js"()` connect `"node_modules/@supabase/auth-js/dist/main/lib/helpers.js"` to `.test.js`, `toString`, `match`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `withGlobal()` connect `withGlobal` to `constructor`, `match`, `requireLib`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `"node_modules/@supabase/auth-js/dist/main/lib/base64url.js"()` connect `"node_modules/@supabase/auth-js/dist/main/lib/base64url.js"` to `.test.js`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `assert()` (e.g. with `.test.js` and `showDiff()`) actually correct?**
  _`assert()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 30 inferred relationships involving `"node_modules/tslib/tslib.es6.mjs"()` (e.g. with `__addDisposableResource()` and `__asyncDelegator()`) actually correct?**
  _`"node_modules/tslib/tslib.es6.mjs"()` has 30 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `withGlobal()` (e.g. with `createClock()` and `install()`) actually correct?**
  _`withGlobal()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-6749`, `__dirname`, `cfgPath` to the rest of the system?**
  _371 weakly-connected nodes found - possible documentation gaps or missing edges._