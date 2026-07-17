# DOSSIER X
# UI_IMPLEMENTATION_GUIDE.md
Version: 1.0

---

# PURPOSE

This document defines the visual implementation of every screen.
These instructions override any AI-generated design decisions.
Developers must NOT redesign the interface.
The provided reference screens are the source of truth.
Every screen must match them as closely as possible.

---

# GLOBAL RULES

The interface is NOT a website.
The interface is NOT a dashboard.
The interface is NOT a game menu.
The interface is professional investigation software.
Think FBI. Think CIA. Think Police Evidence System. Think Detective Workstation.
Everything must feel believable.

---

# GLOBAL LAYOUT

The application always contains three areas.
LEFT — Permanent Sidebar
CENTER — Main Content
RIGHT — Context Panel (only when required)

The sidebar NEVER changes between pages.
Only the center content changes.

---

# SIDEBAR

Reference Image: sidebar-reference.png

Requirements
Width: 320px
Height: 100%
Position: Fixed
Background: Dark Charcoal
Border: 1px subtle border

Top: DOSSIER X Logo
Below: Detective Profile

Navigation
Archive, Case File, Crime Scene, Evidence Locker, Suspects, Witnesses,
Timeline, My Notebook, Questions, Certificates, Achievements, Settings

Bottom: Language Switch, Version Number

Never collapse on desktop.

---

# DETECTIVE PROFILE

Always visible.
Contains: Detective Avatar, Detective Name, Current Rank, XP Progress,
Solved Cases, Animated XP Bar
Hover displays statistics.

---

# ARCHIVE

Reference: archive-reference.png

Requirements
Display investigation cards.
Desktop: 3 Columns / Tablet: 2 Columns / Mobile: 1 Column
Card Size: 300x420
Large cover image, Status Badge, Difficulty, Estimated Time, Documents
Count, Evidence Count, Continue Button

Hover: Card lifts 4px. Shadow increases. Border becomes gold.

---

# LOCKED INVESTIGATION

Reference: locked-case-reference.png

Display: Large Cover, Red CLASSIFIED Stamp, Access Denied, Difficulty,
Evidence Count, Estimated Time, BUY CASE Button

Hover reveals short teaser. Click opens purchase dialog.

---

# PURCHASE DIALOG

Dark glass background. Case cover. Description. Difficulty. Estimated play
time. Price. BUY NOW button. Close button.
The BUY NOW button redirects to Gumroad.

---

# CASE FILE

Reference: case-file-reference.png

Three-column layout.
Left: Navigation
Center: Document Viewer
Right: Quick Information, Notebook, Pinned Evidence

Documents appear as realistic paper. No plain white cards.

---

# DOCUMENT VIEWER

Paper texture. Subtle shadow. A4 proportions.
Zoom, Fullscreen, Page Navigation, Print, Download
Never display raw JSON.

---

# CRIME SCENE

Reference: crime-scene-reference.png

Large photograph. 80% width. Evidence markers. Zoom. Pan. Fullscreen.

Right panel: Evidence list, Victim information, Weather, Time, Location

---

# EVIDENCE LOCKER

Reference: evidence-locker-reference.png

Grid: 4 columns

Evidence Card: Photo, Evidence Number, Category, Status

Click opens evidence details. Animation: Folder opening.

---

# SUSPECTS

Reference: suspects-reference.png

Profile Cards: Photo, Name, Occupation, Age, Relationship, Suspicion Meter,
Status

Read-only. Player cannot edit.

---

# WITNESSES

Reference: witnesses-reference.png

Profile: Photo, Statement, Reliability, Interview Date, Linked Evidence

Player can only bookmark. No editing.

---

# TIMELINE

Reference: timeline-reference.png

Vertical line. Animated appearance.
Each event contains: Time, Title, Description, Linked Evidence
Click jumps to document.

---

# NOTEBOOK

Reference: notebook-reference.png

Looks like a real detective notebook. Paper texture. Auto-save. Search.
Pin. Bookmarks. Export. Every note has timestamp.

---

# QUESTIONS

Reference: questions-reference.png

Professional exam interface. Progress bar. Question number. Previous,
Next, Review, Submit Investigation. No playful UI.

---

# FINAL REPORT

Reference: report-reference.png

Summary of answers. Evidence used. Accuracy. Score. Rank. Certificate
preview. Finish Investigation button.

---

# CERTIFICATES

Reference: certificate-reference.png

Luxury certificate. Gold border. Official seal.
Player Name, Case Name, Rank, Date, Certificate Number
Buttons: Print, Download PDF, Share Image

---

# ACHIEVEMENTS

Reference: achievements-reference.png

Grid layout. Unlocked: Gold border. Locked: Dark. Hover: Displays
description.

---

# SETTINGS

Reference: settings-reference.png

Language, Sound, Export Progress, Import Progress, Reset Progress, About
No unnecessary settings.

---

# COLORS

Primary Background: #111315
Sidebar: #181A1C
Card: #24272B
Paper: #ECE5D8
Gold: #C8A646
Dark Red: #8A1E22
Text: #F4F4F4
Secondary Text: #A8A8A8

---

# TYPOGRAPHY

Arabic: IBM Plex Sans Arabic
English: Inter
Body: 16px
Headings: 28px
Sidebar: 15px
Buttons: 15px SemiBold

---

# BUTTONS

Primary: Gold
Secondary: Dark
Danger: Dark Red
Radius: 12px
Height: 48px

---

# ICONS

Lucide React only. Outline style. No filled icons.

---

# ANIMATIONS

Folder Open, Folder Close, Fade, Slide, Scale, Blur
Maximum duration: 300ms
Never use bounce effects.

---

# SOUNDS

Folder, Paper, Typing, Pen, Stamp, Soft Click
No loud sounds.

---

# RESPONSIVE

Desktop: Full Sidebar
Tablet: Compact Sidebar
Mobile: Drawer Sidebar

The design language must remain identical across all devices.

---

# FINAL RULE

The reference images supplied with this project are the highest design
authority.
If there is any conflict between this document and generated UI,
THE REFERENCE IMAGES ALWAYS WIN.
Do not redesign. Recreate.
