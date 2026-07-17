# DOSSIER X Tools

Standalone helper scripts for working with `.casepack` files outside the
main app. Run with Node.js (the same one you already installed for the
project) — no extra setup needed.

## repack-images.mjs

Swaps real images into an existing `.casepack` without you needing to
touch ZIP internals by hand.

### Usage

```
node tools/repack-images.mjs <original.casepack> <new-images-folder> <output.casepack>
```

- `<original.casepack>` — the case file you already have (e.g. DX001.casepack)
- `<new-images-folder>` — a folder on your computer laid out exactly like
  the package's `assets/` folder, containing only the images you want to
  replace (you don't need every image — only include the ones you've
  actually generated; everything else is copied over unchanged)
- `<output.casepack>` — where to write the new file

### Example

Say you've generated real art for the cover and all 5 suspects, and saved
them in a folder like this on your computer:

```
my-new-images/
├── covers/
│   └── cover.webp
└── suspects/
    ├── 001.webp
    ├── 002.webp
    ├── 003.webp
    ├── 004.webp
    └── 005.webp
```

Run:

```
node tools/repack-images.mjs DX001.casepack my-new-images DX001.casepack
```

(Using the same path for input and output overwrites it in place — use a
different output name first if you want to keep the placeholder version
around too.)

The script only replaces files that exist in your new-images folder —
witnesses, evidence, and crime scene images stay as placeholders until you
add those too. Run it again as you generate more art; you don't have to
do it all at once.
