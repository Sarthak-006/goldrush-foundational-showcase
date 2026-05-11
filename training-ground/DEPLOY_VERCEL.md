# Deploy Training Ground to Vercel

The deployable Next.js app lives in **`training-ground/`** with its own `package-lock.json`. Local development can still use the repo workspace from the root (`npm run dev -w training-ground`).

## New Vercel project (GitHub import)

1. Import `Sarthak-006/goldrush-foundational-showcase` on branch **`main`**.
2. **Framework Preset:** Next.js (auto-detected).
3. **Root Directory:** `training-ground` — required. Do not use the repository root.
4. **Build and Output Settings:** leave **Install Command** and **Build Command** empty so Vercel uses the defaults (`npm ci`, `next build`).
5. **Environment variables** (Production and Preview):
   - `GOLDRUSH_API_KEY` — your GoldRush / Covalent API key.
   - Optional after the first deploy: `NEXT_PUBLIC_SITE_URL` = `https://<your-project>.vercel.app`.
6. Deploy.

## After deploy

Open the site, choose a demo preset, and click **Kick off matchday**. You should see stat cards, the pitch XI, the roster table, season momentum, and contract talks when approvals exist.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ENOENT` under `@swc/helpers` or `.next` not found | Root Directory must be **`training-ground`**. Clear any custom Install/Build overrides in Vercel. Redeploy from latest `main`. |
| 503 on `/api/matchday` | Set `GOLDRUSH_API_KEY` (or `COVALENT_API_KEY`) in Vercel env; redeploy. |
| Wrong Open Graph URL | Set `NEXT_PUBLIC_SITE_URL` to the live production URL. |

## CLI (optional)

```bash
cd training-ground
npx vercel login
npx vercel link
npx vercel env add GOLDRUSH_API_KEY production
npx vercel --prod
```

## GitHub Actions (optional)

See `.github/workflows/deploy-training-ground.yml`. The linked Vercel project must also use Root Directory **`training-ground`**.
