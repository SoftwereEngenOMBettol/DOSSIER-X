# DOSSIER X
# DESIGN_SYSTEM.md
Version: 1.0

---

# PURPOSE

This document defines the complete visual language of DOSSIER X.
The goal is to create the feeling that the player is using a real police investigation system.
The interface should never look like a casual website or a traditional game.
It must feel like professional investigation software.

---

# DESIGN PHILOSOPHY

Keywords: Professional, Minimal, Elegant, Government, Police, Evidence, Investigation, Film Noir, Premium, Immersive.
Everything should feel believable.

---

# DESIGN REFERENCES

Inspired by
FBI Investigation Files
Police Evidence Rooms
Criminal Investigation Archives
Dark Government Software
Modern Intelligence Systems
Premium Desktop Applications

Never imitate gaming dashboards.

---

# COLOR SYSTEM

Primary Background: #111315
Secondary Background: #1A1D20
Sidebar: #181A1C
Card Background: #24272B
Old Paper: #ECE5D8
Paper Shadow: #D5CCBE
Gold: #C8A646
Archive Brown: #5D4B39
Dark Red: #8A1E22
Evidence Red: #B22222
Success: #2E7D32
Warning: #C49000
Text Primary: #F5F5F5
Text Secondary: #A5A5A5
Border: rgba(255,255,255,.08)

---

# TYPOGRAPHY

English: Inter
Arabic: IBM Plex Sans Arabic
Weights: 400, 500, 600, 700
Headings: Bold, Uppercase, Letter spacing 1px

---

# ICON STYLE

Outline Icons. Minimal. Professional. Lucide Icons. No cartoon icons.

---

# SHADOWS

Very soft. Never exaggerated. Cards should float slightly.

---

# RADIUS

Buttons: 12px
Cards: 18px
Dialogs: 20px
Images: 14px

---

# ANIMATION

Use Framer Motion.
Animations should be slow, elegant, natural. Never flashy.
Duration: 200ms / 300ms / 500ms
Use: Fade, Slide, Scale, Blur
No bouncing.

---

# LAYOUT

Desktop
Sidebar: 320px
Content: Fluid
Maximum width: 1600px

---

# SIDEBAR

Sidebar never changes. Every page shares the exact same sidebar.

Sections
Archive, Case File, Crime Scene, Evidence Locker, Suspects, Witnesses,
Timeline, My Notebook, Questions, Final Report, Certificates, Achievements,
Settings

Bottom
Detective Profile, Version, Language Switch

---

# DETECTIVE PROFILE

Always visible.
Contains: Photo Placeholder, Detective Name, Current Rank, Solved Cases, XP Progress

---

# ARCHIVE PAGE

Layout: Large investigation cards.

Each card contains
Cover, Title, Difficulty, Estimated Time, Status (Owned/Locked/Completed)

Never use tables.

---

# LOCKED CASE CARD

Shows: Large Cover, CLASSIFIED Stamp, Access Denied, Difficulty, Documents
Count, Evidence Count, Witness Count, Buy Button

Hover animation reveals teaser.

---

# OWNED CASE CARD

Shows: Cover, Progress, Continue Button, Completion Badge, Estimated Time,
Last Played

---

# CASE VIEW

Three-column layout.
Sidebar: Navigation
Center: Document Viewer
Right: Quick Details, Notebook, Pinned Evidence

---

# DOCUMENT VIEWER

Looks like a real PDF. Paper texture. Subtle shadow. Printable.
Zoom, Fullscreen, Page Navigation

---

# CRIME SCENE

Large image. Zoom, Pan, Fullscreen. Evidence markers. Evidence highlights.

---

# EVIDENCE LOCKER

Grid layout. Evidence cards.

Each card contains: Photo, Evidence ID, Category, Status

Click opens detailed report.

---

# SUSPECTS

Profile cards. Photo, Occupation, Age, Relationship, Suspicion Meter.
Click opens profile. Player cannot edit.

---

# WITNESSES

Read-only. Statement. Reliability. Interview Date. Related Evidence.
Add to Notebook only.

---

# TIMELINE

Vertical timeline. Animated. Time, Event, Related Evidence.
Click jumps to related documents.

---

# NOTEBOOK

Looks like detective notebook. Handwritten font optional. Auto-save.
Search notes. Pin notes. Export notes.

---

# QUESTIONS

Professional exam layout. Progress bar. Previous, Next, Review Answers,
Submit Investigation.

---

# CERTIFICATE

Luxury certificate. Gold border. Embossed seal.
Detective Name, Case, Rank, Date, Certificate Number
Print, Download PDF

---

# ACHIEVEMENTS

Grid. Locked achievements appear dark. Unlocked achievements animate slightly.

---

# SETTINGS

Language, Theme (future), Sound, Music, Export Progress, Import Progress,
Reset Notebook, Reset Progress, About

---

# MICRO INTERACTIONS

Hover cards, Paper movement, Stamp animation, Typing sound, Folder opening
sound, Soft click sounds. Everything subtle.

---

# RESPONSIVE

Desktop, Tablet, Mobile. All pages usable. Sidebar becomes drawer on mobile.
No horizontal scroll.

---

# BRANDING

Logo always visible. Premium identity. Never overcrowd the interface.
Whitespace is important. Every screen should feel cinematic.
