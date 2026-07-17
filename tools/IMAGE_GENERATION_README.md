# Automated Case Image Generation

Fully automated: point it at a case's `image-requests.json`, it calls
Gemini for every image, converts each to WebP, and writes it to the
correct path. No manual generation, renaming, or format conversion.

## Setup (once)

```bash
cd tools
pnpm install          # if you haven't already, from the repo root: pnpm install
export GEMINI_API_KEY=your-real-key-here
```

Get a key at https://aistudio.google.com/apikey. Never put it in a file
that gets committed or shared — this tool only ever reads it from the
environment variable, on purpose.

**If you're using the key you pasted into this chat earlier**: rotate it
first. Once a key has been shared in a conversation, treat it as
potentially exposed regardless of what happens next.

## Run it

```bash
node --import tsx generate-case-images.ts <path-to-image-requests.json> <output-assets-dir>
```

Example, using the real DX003 manifest included here:

```bash
node --import tsx generate-case-images.ts image-requests.example.json ../../dx003-build/assets
```

This will:
1. Call Gemini (`gemini-3.1-flash-image` — the current model; the older
   Imagen API is deprecated and shuts down August 17, 2026, so this
   deliberately doesn't use it) for every entry in the manifest
2. Convert each result to WebP
3. Write it to `<output-dir>/<targetPath>`, creating subfolders as needed
4. Print a live progress line per image
5. If some images fail (declined prompt, rate limit, network blip), the
   rest keep going — failures are collected and written to
   `generation-errors.json` next to your output folder, not thrown away

## The manifest format

`image-requests.json` is a flat array:

```json
[
  {
    "targetPath": "suspects/001.webp",
    "prompt": "Mugshot-style portrait of...",
    "aspectRatio": "3:4",
    "maxDimension": 1600
  }
]
```

- `targetPath` — must end in `.webp`, relative to the output dir you pass
- `prompt` — sent to Gemini as-is
- `aspectRatio` — optional, one of the values Gemini's API accepts (`1:1`, `3:4`, `4:3`, `16:9`, etc.)
- `maxDimension` — optional; if the generated image's longest side exceeds this, it's downscaled before saving

`image-requests.example.json` in this folder is DX003's real, complete
manifest (40 real prompts, not placeholders) — a working example, not a
toy one.

## What this does NOT do

It does not write the case's story, suspects, evidence text, or JSON
files — that's a separate, much larger undertaking (effectively an
AI case-writing system) that hasn't been built. This tool handles the
image half of the pipeline: prompts in, WebP files on disk out.

## Architecture, if you want to swap providers later

- `packages/image-provider` — the `ImageProvider` interface, plus
  `GeminiImageProvider` (real) and `FakeImageProvider` (for tests, no
  network needed)
- `packages/image-pipeline` — `runImagePipeline()`, which takes any
  `ImageProvider` and handles conversion/resize/write/error-isolation

Adding OpenAI or another provider later means writing one new class that
implements `ImageProvider` — nothing else in the pipeline changes.
