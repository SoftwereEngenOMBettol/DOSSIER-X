# DOSSIER X
# CASE_PACKAGE_SPEC.md
Version 1.0
---
# PURPOSE
This document defines the official DOSSIER X investigation package format.
Every investigation must be portable, self-contained, versioned and installable.
The package format is the only way to distribute investigations.
---
# PACKAGE EXTENSION
.casepack
Internally it is a ZIP archive.
The user never edits it manually.
---
# PACKAGE STRUCTURE
DX001.casepack
├── manifest.json
├── license.json
├── case.json
├── victim.json
├── suspects.json
├── witnesses.json
├── evidence.json
├── timeline.json
├── questions.json
├── solution.json
├── translations/
│   ├── ar.json
│   └── en.json
├── documents/
├── images/
├── audio/
├── certificates/
└── cover.webp
---
# INSTALL FLOW
User selects .casepack
↓
Read Manifest
↓
Validate Package
↓
Verify Engine Version
↓
Verify License
↓
Install Assets
↓
Store Metadata
↓
Show Installed
---
# PACKAGE VERSIONING
Every package contains
Package Version
Engine Version
Minimum Player Version
Case Version
---
# LICENSE
Each package has
License ID
Case ID
Issue Date
Checksum
Digital Signature
License Type
---
# VALIDATION
Reject package if
Missing files
Invalid manifest
Corrupted JSON
Unsupported version
Broken assets
Invalid license
---
# UPDATE SYSTEM
Future versions can update
Documents
Images
Translations
Audio
Without replacing player progress.
---
# EXPORT
Studio exports exactly one .casepack file.
No additional manual work required.
