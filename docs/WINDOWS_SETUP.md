# Running DOSSIER X on Windows

Everything in this repo is plain Node.js/TypeScript — no OS-specific code.
The only two things that trip people up on Windows are **PowerShell's
script execution policy** and **pnpm's use of symlinks**, both covered
below. Neither is specific to this project; they affect any pnpm-based
Node project on Windows.

## 1. Install prerequisites

- **Node.js LTS (v20+)** — download the Windows installer from
  [nodejs.org](https://nodejs.org) and run it. This also installs `npm`.
- **pnpm** — open PowerShell or Command Prompt and run:
  ```
  npm install -g pnpm
  ```

## 2. If PowerShell refuses to run `pnpm`

You may see:
```
pnpm : File C:\...\pnpm.ps1 cannot be loaded because running scripts is
disabled on this system.
```
This is PowerShell's default script execution policy, not a problem with
pnpm. Fix it once, for your user account only:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
Or sidestep it entirely by using **Command Prompt (cmd.exe)** instead of
PowerShell for these commands — cmd.exe doesn't have this restriction.

## 3. If `pnpm install` fails with a symlink/permission error

pnpm links workspace packages (`@dossier-x/ui`, etc.) using symlinks.
Windows allows this without administrator rights only when **Developer
Mode** is on:

Settings → Privacy & Security → For developers → **Developer Mode: On**

Then re-run `pnpm install`. (Running your terminal as Administrator also
works, but enabling Developer Mode once is the better long-term fix.)

## 4. Extract and run

1. Right-click the downloaded `.zip` → **Extract All**.
2. Open a terminal (Command Prompt or PowerShell) and `cd` into the
   extracted `dossier-x` folder.
3. Install dependencies:
   ```
   pnpm install
   ```
4. Run the Player app:
   ```
   pnpm dev:player
   ```
   Open **http://localhost:3000** in your browser.
5. To also run CASEFORGE Studio, open a **second** terminal window in the
   same folder (leave the first one running) and:
   ```
   pnpm dev:caseforge
   ```
   Open **http://localhost:3001** in your browser.

Both apps hot-reload as files change, same as on Mac/Linux.

## 5. Everyday commands (identical to Mac/Linux — no `bash`/`sh` required)

```
pnpm typecheck
pnpm -r lint
pnpm test
pnpm build
pnpm clean
```

All of these are plain Node.js CLI tools (`tsc`, `eslint`, `vitest`,
`next`, `rimraf`) invoked directly — none of them shell out to Unix
commands, so they run identically in Command Prompt, PowerShell, or Git
Bash.

## 6. Stopping the dev servers

`Ctrl+C` in each terminal window, same as any other platform.
