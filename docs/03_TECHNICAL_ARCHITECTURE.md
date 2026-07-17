# DOSSIER X
# TECHNICAL_ARCHITECTURE.md
Version 1.0

---

# PURPOSE

This document defines the complete technical architecture of DOSSIER X.
It explains how every system works internally.
This architecture must remain scalable for years without requiring major refactoring.

---

# ARCHITECTURE

The project contains two applications.
DOSSIER X — Player Application
CASEFORGE Studio — Administrator Application
Both applications live inside the same repository.

---

Repository

/apps
    player/
    studio/

/packages
    ui/
    engines/
    translations/
    types/
    utils/

/docs

/public

---

# PLAYER APPLICATION

Responsibilities
• Home Screen
• Archive
• Investigation Viewer
• Notebook
• Certificates
• Achievements
• Settings

The player application NEVER creates investigations.
It only reads investigation packages.

---

# STUDIO APPLICATION

Responsibilities
Create Investigation
Edit Investigation
Generate Documents
Generate Images
Generate PDFs
Preview Investigation
Generate Case Package
Export

The Studio creates investigation packages.
The Player consumes investigation packages.

---

# INVESTIGATION ENGINE

Never hardcode investigations.
Every investigation is loaded dynamically.
The engine reads JSON files.
The UI renders those files.

Investigation Flow

.casepack
↓
Extract
↓
Validate
↓
Install
↓
IndexedDB
↓
Archive
↓
Open Investigation

---

# PACKAGE FORMAT

Every investigation is distributed as a single package.
Extension: .casepack
Internally it is a ZIP archive.

Structure

manifest.json
case.json
victim.json
suspects.json
witnesses.json
timeline.json
questions.json
solution.json
documents/
images/
audio/
translations/
license.json
cover.webp
thumbnail.webp

---

# MANIFEST

Example

{
"id":"DX001",
"version":"1.0.0",
"title":{
"ar":"الغرفة 308",
"en":"Room 308"
},
"difficulty":"Beginner",
"estimatedTime":90,
"language":["ar","en"],
"engine":"1.0"
}

The manifest is always loaded first.

---

# STORAGE

Never use online databases.
Never use servers.
Use IndexedDB.

Database: DOSSIER_X

Stores
Player Profile
Installed Cases
Settings
Notebook
Achievements
Certificates
Progress
Bookmarks
Cached Images

---

# PLAYER PROFILE

Store
Name
Language
Rank
XP
Cases Solved
Achievements
Certificates
Date Created

---

# INSTALLED CASES

Each installed case contains
Case ID
Installed Version
Installed Date
Current Progress
Unlocked
Completed
Last Opened

---

# SAVE ENGINE

Every interaction automatically saves.

Examples
Open Document → Save
Read Witness → Save
Write Note → Save
Answer Question → Save

No manual save button.

---

# NOTEBOOK ENGINE

Notebook is stored separately.
Never modify investigation files.
Notebook belongs to the player.

Each note contains
Case ID
Date
Time
Text
Pinned

---

# CERTIFICATE ENGINE

Certificate generation is dynamic.

Input
Player Name
Case
Rank
Date
Score

Generate
Certificate PDF
Certificate Image
Certificate JSON

---

# ACHIEVEMENT ENGINE

Achievements are rule based.

Examples
First Investigation
Perfect Score
Complete Without Notes
Complete Under 60 Minutes
Solve 10 Cases
Master Detective

Every achievement contains
ID
Title
Description
XP Reward
Icon
Unlocked

---

# IMPORT ENGINE

Import
.casepack
↓
Validate
↓
Verify Structure
↓
Read Manifest
↓
Read License
↓
Copy Files
↓
Install
↓
Update Archive

---

# VALIDATION

Reject package if
Manifest missing
Solution missing
License missing
Images missing
Version unsupported
Corrupted JSON

---

# ARCHIVE ENGINE

Archive loads dynamically.

Display
Installed Cases
Locked Cases
Completed Cases
Recently Played

No hardcoded cards.
Everything comes from installed packages.

---

# LOCALIZATION

Every investigation supports Arabic and English.
Translation files are located inside each package.
No hardcoded strings.

---

# MEDIA ENGINE

Supports Images, PDF, Audio, Future Video.
All media loaded lazily.

---

# PDF ENGINE

Every document can be Previewed, Printed, Downloaded.
Same HTML generates PDF.
No duplicate templates.

---

# QUESTION ENGINE

Questions are defined in JSON.

Supports
Multiple Choice
Single Choice
Free Text
Evidence Selection
Timeline Ordering

The engine compares answers with solution.json

---

# SCORING ENGINE

Score calculated from
Correct Answers
Completion Time
Notebook Usage
Hints Used (future)

Generate
Rank
XP
Certificate

---

# SECURITY

Investigation packages are read-only.
Player notes are separate.
Solution files never displayed.
License validation before installation.

---

# PERFORMANCE

Lazy loading
Image optimization
Code splitting
Component memoization
Virtual scrolling where necessary

---

# FUTURE EXTENSIONS

Cloud Save
Online Marketplace
Community Cases
Multiplayer
Daily Challenges
Steam Integration
Mobile App

The architecture must allow these without breaking existing code.

---

# DEVELOPMENT RULES

Every feature must be modular.
Every engine must be isolated.
Every component must be reusable.
No duplicated logic.
No hardcoded investigation content.
Everything must be driven by JSON.

The architecture should support unlimited investigations without requiring code changes.
