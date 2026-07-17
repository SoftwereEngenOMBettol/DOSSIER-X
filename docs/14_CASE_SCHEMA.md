# DOSSIER X
# CASE_SCHEMA.md
DOSSIER X Investigation Package Specification
Version: 1.0
Status: Authoritative for file shapes. Cross-file relationships/trigger
mechanics are explicitly NOT yet specified — see "Before We Continue" at
the bottom of this document.

---

# PURPOSE

The `.casepack` file is the fundamental unit in DOSSIER X. Every case is
an independent file that can be sold, shared, imported, updated, and
integrity-checked — without needing a database or internet connection.

---

# PACKAGE STRUCTURE

Every case is a file: `DX001.casepack`. Opened, it contains:

```
DX001.casepack
│
├── manifest.json
├── case.json
├── victim.json
├── suspects.json
├── witnesses.json
├── evidence.json
├── crime_scene.json
├── timeline.json
├── documents.json
├── questions.json
├── solution.json
├── certificate.json
├── achievements.json
├── localization.json
├── assets.json
├── license.json
│
├── assets/
│   ├── covers/
│   ├── suspects/
│   ├── victim/
│   ├── witnesses/
│   ├── evidence/
│   ├── crime_scene/
│   ├── documents/
│   ├── maps/
│   ├── icons/
│   └── audio/
│
└── README.md
```

---

# manifest.json

The first file the program reads.

```json
{
  "id": "DX001",
  "version": "1.0.0",
  "title": "The Silent Room",
  "difficulty": "Intermediate",
  "estimatedTime": 90,
  "author": "DOSSIER X",
  "language": ["ar", "en"],
  "cover": "assets/covers/cover.webp",
  "packageVersion": "1.0",
  "createdAt": "2026-07-14",
  "updatedAt": "2026-07-14"
}
```

---

# case.json

Case information.

```json
{
  "id": "DX001",
  "title": { "ar": "الغرفة الصامتة", "en": "The Silent Room" },
  "description": { "ar": "", "en": "" },
  "category": "Murder",
  "difficulty": "Intermediate",
  "estimatedMinutes": 90
}
```

---

# victim.json

```json
{
  "id": "victim_001",
  "name": "",
  "age": 42,
  "occupation": "",
  "causeOfDeath": "",
  "timeOfDeath": "",
  "location": "",
  "photo": "assets/victim/victim.webp"
}
```

---

# suspects.json

Each suspect has an independent id.

```json
[
  {
    "id": "suspect_001",
    "name": "",
    "age": 35,
    "occupation": "",
    "relationship": "",
    "motive": "",
    "photo": "assets/suspects/001.webp"
  }
]
```

---

# witnesses.json

```json
[
  {
    "id": "witness_001",
    "name": "",
    "statement": "",
    "reliability": 90,
    "photo": "assets/witnesses/001.webp"
  }
]
```

---

# evidence.json

```json
[
  {
    "id": "ev001",
    "title": "",
    "type": "Fingerprint",
    "description": "",
    "image": "assets/evidence/001.webp",
    "unlockTrigger": "crime_scene_complete"
  }
]
```

Note: `unlockTrigger` is used instead of a percentage, so evidence stays
tied to events, as agreed.

---

# crime_scene.json

```json
{
  "id": "scene001",
  "name": "",
  "description": "",
  "images": ["assets/crime_scene/1.webp", "assets/crime_scene/2.webp"]
}
```

---

# timeline.json

```json
[
  { "id": "event001", "time": "19:20", "title": "", "description": "" }
]
```

---

# documents.json

Each report is an independent item.

```json
[
  {
    "id": "doc001",
    "type": "Police Report",
    "title": "",
    "file": "assets/documents/police.pdf"
  }
]
```

---

# questions.json

```json
[
  {
    "id": "q001",
    "type": "multiple_choice",
    "question": "",
    "options": ["A", "B", "C", "D"],
    "answer": "B"
  }
]
```

---

# solution.json

This file is never shown to the player — used only for evaluating answers.

```json
{ "killer": "suspect_002", "weapon": "Knife", "motive": "Revenge", "perfectScore": 100 }
```

---

# certificate.json

```json
{ "title": "Master Detective", "template": "gold", "minimumScore": 90 }
```

---

# achievements.json

```json
[ { "id": "first_case", "title": "First Investigation", "xp": 100 } ]
```

---

# localization.json

Links text to supported languages. (No concrete shape given yet.)

---

# assets.json

An index of every file under `assets/`, with its type and path, so Player
and CASEFORGE can verify the package is complete. (No concrete shape
given yet.)

---

# license.json

License information (package version, publisher, possibly a license key
in the future). Not intended as strong protection — it organizes
distribution. (No concrete shape given yet.)

---

# IMPORTANT RULE

Every element in every file must have:

- A unique, stable `id`.
- Translatability if it contains text.
- No dependency on array element order.

This keeps cases easy to update and merge without breaking compatibility.

---

# BEFORE WE CONTINUE (project owner's note)

This is v1.0 of the specification. It's still missing something very
important: the **relationships** between files. For example:

- How does a specific piece of evidence link to a suspect?
- How does a witness link to timeline events?
- How does a report unlock after a specific piece of evidence is
  discovered?
- How does the engine know a question depends on multiple pieces of
  evidence?

This part is considered more important than the shape of the JSON files
themselves, because it defines the entire investigation logic. The
recommended next step is writing **CASE_SCHEMA v2 – Relationships &
Investigation Logic** before the game engine is completed.

**Implementation status**: everything with a concrete example above
(manifest, case, victim, suspects, witnesses, evidence, crime_scene,
timeline, documents, questions, solution, certificate, achievements) is
implemented — parsed, validated, stored, and displayed read-only. The
three fields with no concrete example (localization.json, assets.json,
license.json) are stored but not deeply validated. `unlockTrigger` is
stored as a raw string; nothing resolves or acts on it yet. No scoring,
grading, achievement-unlocking, or certificate-eligibility logic has been
built — all of that depends on the relationships layer described above.
See `docs/PHASE_2_NOTES.md` for the full list of decisions made while
implementing this.
