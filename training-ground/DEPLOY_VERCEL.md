# Deploy Training Ground to Vercel

The repo uses an **npm workspace**: the Next.js app is the **`training-ground`** package. The **root** `package-lock.json` installs dependencies and **hoists `next` to `node_modules/next`**.

## Root Directory (pick one)

| Vercel Root Directory | Config file | Install | Build |
|----------------------|-------------|---------|-------|
| **`training-ground`** (recommended) | `training-ground/vercel.json` | `cd .. && npm ci` | `npm run build` |
| **Repository root** (`./`) | root `vercel.json` | `npm ci` | `npm run build -w training-ground` then copy `.next` to repo root |

If the build compiles but deploy fails with **“.next was not found at `/vercel/path0/.next`”**, the app root and output folder do not match — use **`training-ground`** as Root Directory, or keep repo root and use the root `vercel.json` copy step.

Enable **Include source files outside of the Root Directory** when Root Directory is `training-ground`.

## Option A — GitHub import

1. Import this repo on **latest `main`** (includes root `package-lock.json` and workspace `package.json`).
2. **Root Directory:** `training-ground` (recommended) or `./` with root `vercel.json`.
3. **Environment variables:** `GOLDRUSH_API_KEY` or `COVALENT_API_KEY` (Production + Preview as needed).
4. Optional after first deploy: `NEXT_PUBLIC_SITE_URL` = your `https://….vercel.app` URL.
5. Deploy.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| “No Next.js version detected” | Use **latest `main`**; install from repo root (`npm ci` or `cd .. && npm ci`); do not delete root `package-lock.json`. |
| “.next was not found at `/vercel/path0/.next`” | Set Root Directory to **`training-ground`**, or use repo root with the root `vercel.json` copy step. |
| 503 on `/api/matchday` | Set `GOLDRUSH_API_KEY` (or `COVALENT_API_KEY`) in Vercel env; redeploy. |
| Wrong OG URL | Set `NEXT_PUBLIC_SITE_URL` to the live production URL. |

## Option B — CLI

From repository root:

```bash
npx vercel login
npx vercel link
npx vercel env add GOLDRUSH_API_KEY production
npx vercel --prod
```

## Option C — GitHub Actions

See `.github/workflows/deploy-training-ground.yml` — set `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, then run the workflow manually.
