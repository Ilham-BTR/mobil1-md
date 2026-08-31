# Graph Report - Mobil1  (2026-08-31)

## Corpus Check
- 63 files · ~244,296 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 561 nodes · 762 edges · 54 communities (47 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b4e14937`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- visits.js
- UI Components & Forms
- Product Docs & Specs
- DB Schema setup_fresh
- Seed Data Generator
- Build Tooling
- Frontend Dependencies
- Ardiansyah Import
- Visits Import
- Migration 0001 Schema
- Admin Tabs & Excel Export
- Attendance & Report Views
- Photo Upload Pipeline
- Modals & Master Tab
- Backup Script
- Migration 0002 Photos
- Migration 0004 Distributor
- Migration 0006 Status
- Restore Script
- Migration 0012 Gimmick/Planogram
- Migration 0016 Putih Photos
- Visit Form & Map
- WebAuthn Edge Function
- Get-Upload-URL Function
- Migration 0007 WebAuthn
- Migration 0010 TL Role
- Migration 0014 TL Multi-Region
- Bengkel Import
- App Root Views
- Admin-Create-MD Function
- Vercel Config
- Run-SQL Script
- Migration 0005 Distributors
- Profiles Policy 0009
- vite.config.js
- measure.mjs
- visit_list
- master.js
- 0018_egress_log.sql
- migrate.mjs

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
- **Region-Kota-Bengkel-Visit Data Hierarchy** — prd_entity_regions, prd_entity_bengkels, prd_entity_distributors, prd_entity_visits [EXTRACTED 1.00]
- **Presigned Photo Upload Pipeline** — readme_lib_storage, prd_edge_function_get_upload_url, readme_s3_object_storage, prd_backblaze_b2 [EXTRACTED 1.00]

## Communities (54 total, 7 thin omitted)

### Community 0 - "visits.js"
Cohesion: 0.06
Nodes (43): StoredImage(), checkIn(), checkOut(), deleteAttendance(), fetchAttendances(), fetchAttendancesByMonth(), fetchAttendancesByRange(), fetchTodayAttendance() (+35 more)

### Community 1 - "UI Components & Forms"
Cohesion: 0.04
Nodes (24): RFC-4180, ALL_SUBTYPES, App(), BENGKEL_ICON, BLUE_PIN_ICON, COLUMN_ALIASES, EXPORT_PHOTO_HEADER, EXPORT_PHOTO_SKIP (+16 more)

### Community 2 - "Product Docs & Specs"
Cohesion: 0.06
Nodes (37): Supabase Database Backup, backup.mjs Script, restore.mjs Script, Windows Scheduled Backup Task, service_role Key, Dashboard & Admin Report Module, Attendance (Absensi) Module, Authentication Module (+29 more)

### Community 3 - "DB Schema setup_fresh"
Cohesion: 0.12
Nodes (21): public.handle_new_user, bengkels, bengkels_set_updated_at, distributors, get_user_region(), get_user_role(), kotas, md_monthly_performance (+13 more)

### Community 4 - "Seed Data Generator"
Cohesion: 0.08
Nodes (24): bengkelChunks, bengkels, bengkelsCsv, codeSeen, distributors, distributorsCsv, distSeen, ensureKota() (+16 more)

### Community 5 - "Build Tooling"
Cohesion: 0.09
Nodes (21): autoprefixer, devDependencies, autoprefixer, postcss, tailwindcss, vite, @vitejs/plugin-basic-ssl, @vitejs/plugin-react (+13 more)

### Community 6 - "Frontend Dependencies"
Cohesion: 0.10
Nodes (21): browser-image-compression, leaflet, lucide-react, dependencies, browser-image-compression, leaflet, lucide-react, react (+13 more)

### Community 7 - "Ardiansyah Import"
Cohesion: 0.11
Nodes (17): bad, cfg, codeMap, col(), colExact(), colUrl(), distMap, DO_INSERT (+9 more)

### Community 8 - "Visits Import"
Cohesion: 0.12
Nodes (17): bad, cfg, codeMap, distMap, DO_INSERT, emailMap, existKeys, keyOf() (+9 more)

### Community 9 - "Migration 0001 Schema"
Cohesion: 0.22
Nodes (16): bengkels, bengkels_set_updated_at, distributors, get_user_role(), handle_new_user(), kotas, md_monthly_performance, on_auth_user_created (+8 more)

### Community 10 - "Admin Tabs & Excel Export"
Cohesion: 0.20
Nodes (15): AbsenHistory(), AdminAbsenTab(), CoverageTab(), DashboardTab(), excelDateSerial(), excelDateTimeSerial(), exportVisitsXlsx(), fmtAbsenTime() (+7 more)

### Community 11 - "Attendance & Report Views"
Cohesion: 0.17
Nodes (13): attendance_details, attendances, attendances_set_updated_at, profiles, set_updated_at, laporan_absen, laporan_visit, bengkels (+5 more)

### Community 12 - "Photo Upload Pipeline"
Cohesion: 0.18
Nodes (13): index.html (App Entry Point), src/main.jsx (React Entry Script), Backblaze B2 Photo Storage, Cloudflare CDN, Edge Function get-upload-url (Presigned URL), src/App.jsx (UI Components), Cloudflare R2 Storage, IndexedDB Mock Storage (+5 more)

### Community 13 - "Modals & Master Tab"
Cohesion: 0.21
Nodes (12): AbsenTab(), downloadMasterTemplate(), __ensureModalListener(), localDateStr(), __lockBodyScroll(), MasterImportModal(), MasterTab(), MDDashboard() (+4 more)

### Community 14 - "Backup Script"
Cohesion: 0.20
Nodes (6): cfg, cfgPath, __dirname, logFile, supabase, TABLES

### Community 15 - "Migration 0002 Photos"
Cohesion: 0.28
Nodes (8): md_monthly_performance, bengkels, distributors, kotas, profiles, regions, visits, visit_details

### Community 16 - "Migration 0004 Distributor"
Cohesion: 0.28
Nodes (8): md_monthly_performance, bengkels, distributors, kotas, profiles, regions, visits, visit_details

### Community 17 - "Migration 0006 Status"
Cohesion: 0.28
Nodes (8): md_monthly_performance, bengkels, distributors, kotas, profiles, regions, visits, visit_details

### Community 18 - "Restore Script"
Cohesion: 0.25
Nodes (7): cfg, CONFLICT, __dirname, dryRun, onlyArg, payload, supabase

### Community 19 - "Migration 0012 Gimmick/Planogram"
Cohesion: 0.25
Nodes (7): bengkels, distributors, kotas, profiles, regions, visits, visit_details

### Community 20 - "Migration 0016 Putih Photos"
Cohesion: 0.25
Nodes (7): bengkels, distributors, kotas, profiles, regions, visits, visit_details

### Community 21 - "Visit Form & Map"
Cohesion: 0.47
Nodes (6): BengkelMap(), formatDistance(), haversineMeters(), OnSiteBadge(), VisitDetailModal(), VisitForm()

### Community 22 - "WebAuthn Edge Function"
Cohesion: 0.40
Nodes (3): b64urlToBytes(), challengeFromResponse(), corsHeaders

### Community 23 - "Get-Upload-URL Function"
Cohesion: 0.40
Nodes (3): ALLOWED_CONTENT_TYPES, ALLOWED_PHOTO_KEYS, corsHeaders

### Community 24 - "Migration 0007 WebAuthn"
Cohesion: 0.40
Nodes (3): profiles, webauthn_challenges, webauthn_credentials

### Community 25 - "Migration 0010 TL Role"
Cohesion: 0.50
Nodes (3): get_user_region(), md_region(), profiles

### Community 26 - "Migration 0014 TL Multi-Region"
Cohesion: 0.40
Nodes (3): profiles, regions, tl_regions

### Community 27 - "Bengkel Import"
Cohesion: 0.50
Nodes (4): BengkelImportModal(), downloadBengkelTemplate(), normalizeColumn(), validateBengkelRow()

### Community 28 - "App Root Views"
Cohesion: 0.67
Nodes (3): AdminView(), MDView(), useTabBackButton()

### Community 48 - "measure.mjs"
Cohesion: 0.17
Nodes (8): cfg, __dirname, H, month, QUERIES, results, sizeMap, totalGz

### Community 49 - "visit_list"
Cohesion: 0.25
Nodes (7): bengkels, distributors, kotas, profiles, regions, visits, visit_list

### Community 50 - "master.js"
Cohesion: 0.14
Nodes (25): addMaster(), bengkelCacheKey(), bulkAddBengkels(), bulkAddMaster(), bulkCreateMDs(), bustMasterCache(), cachedMaster(), deleteMaster() (+17 more)

### Community 53 - "migrate.mjs"
Cohesion: 0.33
Nodes (4): applied, BASELINE, files, NEVER_AUTO

## Knowledge Gaps
- **151 isolated node(s):** `__dirname`, `cfgPath`, `cfg`, `logFile`, `supabase` (+146 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MOCK_MODE` connect `visits.js` to `UI Components & Forms`, `master.js`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Frontend Dependencies` to `Build Tooling`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `Supabase (Postgres + Auth)` connect `Product Docs & Specs` to `Photo Upload Pipeline`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `__dirname`, `cfgPath`, `cfg` to the rest of the system?**
  _151 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `visits.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `UI Components & Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.03571428571428571 - nodes in this community are weakly interconnected._
- **Should `Product Docs & Specs` be split into smaller, more focused modules?**
  _Cohesion score 0.06456456456456457 - nodes in this community are weakly interconnected._