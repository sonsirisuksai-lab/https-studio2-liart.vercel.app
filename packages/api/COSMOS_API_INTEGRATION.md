# COSMOS API — Integration Guide

> This document explains how `packages/api/` relates to the existing COSMOS OS
> Turborepo project and how to safely integrate it without touching `vercel.json`
> or any existing frontend code.

---

## Why This File Exists (Understanding the Git Situation)

When the backend was scaffolded on Replit, the Replit workspace used a different
monorepo template (pnpm workspaces) than your existing project (npm + Turborepo).
The two have **incompatible git histories** — the Replit workspace has 2 local
commits on a different tree from your remote's 8 commits.

**A blind `git pull` would have caused 393-file merge conflicts** and could have
corrupted both the Replit runtime AND your Vercel deployment. Instead, the backend
was built as a standalone `packages/api/` package that matches your existing
`@cosmos/*` namespace and Turborepo conventions exactly. You add it to your repo
with `git subtree` or a clean copy — no history conflict.

---

## What `packages/api/` Contains

```
packages/api/
├── package.json              @cosmos/api — npm package, matches your workspace conventions
├── tsconfig.json             TypeScript ESM config
├── .env.example              All env vars this service needs
├── src/
│   ├── index.ts              Entry point — starts Express on PORT (default 4000)
│   ├── app.ts                Express app: CORS, rate limiting, routes
│   ├── lib/
│   │   ├── logger.ts         Pino logger (pretty in dev, JSON in prod)
│   │   └── supabase.ts       Supabase admin client + JWT verification helper
│   ├── middleware/
│   │   ├── auth.ts           requireAuth / optionalAuth using Supabase JWT
│   │   └── tokenGuard.ts     Blocks requests when token budget is critical
│   ├── routes/
│   │   ├── index.ts          Route aggregator
│   │   ├── health.ts         GET /api/healthz
│   │   ├── cosmos.ts         GET /api/cosmos/status — Captain Dashboard feed
│   │   ├── missions.ts       GET|PATCH /api/missions/*
│   │   └── agents.ts         GET|POST /api/agents/*
│   └── services/
│       ├── tokenBudget.ts    Token tracker, queue, fallback (per-agent limits via env)
│       └── neuralGrid.ts     Agent state + LLM dispatch seam (mock → real LLM)
├── turbo.json.proposed       Suggested update to root turbo.json
└── vercel.json.proposed      Suggested update to root vercel.json
```

---

## Step 1 — Add `packages/api/` to Your GitHub Repo

**Option A — Copy and push (simplest, no git history conflict):**

```bash
# From your local COSMOS repo checkout
cp -r <replit-workspace>/packages/api ./packages/api
git add packages/api
git commit -m "feat: add @cosmos/api — COSMOS backend orchestrator"
git push origin main
```

**Option B — Cherry-pick from Replit remote (preserves git history):**

```bash
# In your local COSMOS repo
git remote add replit https://github.com/sonsirisuksai-lab/https-studio2-liart.vercel.app.git
git fetch replit
# Cherry-pick only the commit(s) that add packages/api
git cherry-pick <commit-sha-of-packages/api-commit>
git remote remove replit
```

---

## Step 2 — Add `@cosmos/api` to the Root `package.json`

In your repo's root `package.json`, add a dev script:

```json
{
  "scripts": {
    "dev:api": "npm run dev -w @cosmos/api",
    "start:api": "npm run start -w @cosmos/api"
  }
}
```

---

## Step 3 — Update `turbo.json`

Replace your current `turbo.json` with the contents of `packages/api/turbo.json.proposed`.
It adds a `start` task for running the compiled API in production — no other changes.

---

## Step 4 — Configure the Vercel → API Connection

### Option A: Proxy to Replit (Recommended for MVP — zero Vercel config change)

The Replit API is already live. From your Vercel frontend, call:

```typescript
// In packages/web — set in Vercel env vars:
// VITE_API_URL = https://<your-replit-workspace>.replit.app/api

const BASE = import.meta.env.VITE_API_URL ?? "/api";

// Captain Dashboard feed
const res = await fetch(`${BASE}/cosmos/status`);
const { active_mission, progress, system_resonance } = await res.json();

// Dispatch to an agent (requires Supabase auth header)
const { data: { session } } = await supabase.auth.getSession();
const dispatchRes = await fetch(`${BASE}/agents/starlight/dispatch`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session?.access_token}`,
  },
  body: JSON.stringify({ task: "Anchor dimensional resonance" }),
});
```

### Option B: Proxy via Vercel rewrites (keep everything on one domain)

Replace your `vercel.json` with the contents of `packages/api/vercel.json.proposed`,
substituting `<YOUR-REPLIT-URL>` with your actual Replit workspace URL.

This makes `https://your-vercel-app.vercel.app/api/*` transparently proxy to the
Replit API — no CORS issues, same origin from the browser's perspective.

### Option C: Deploy `@cosmos/api` as a separate Vercel project

```bash
cd packages/api
npm install
vercel --prod
# → gives you https://cosmos-api.vercel.app
# Set VITE_API_URL=https://cosmos-api.vercel.app/api in your web Vercel project
```

---

## Step 5 — Set Environment Variables

### On Replit (already running backend)

In Replit Secrets, set:
```
CORS_ORIGIN=https://your-vercel-app.vercel.app
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### On Vercel (frontend)

In Vercel → Settings → Environment Variables:
```
VITE_API_URL=https://<your-replit-url>.replit.app/api
```

---

## Step 6 — Wire Real LLM Calls (When Ready)

Open `packages/api/src/services/neuralGrid.ts` and find the `dispatch()` method.
Replace the `// ── TODO: Replace with real LLM call ──` block:

```typescript
// Using @cosmos/core's Gemini client (already in your packages/core):
import { createGeminiClient } from "@cosmos/core";

const gemini = createGeminiClient({ apiKey: process.env.GEMINI_API_KEY });
const result = await gemini.generateContent(task);
response = result.text;
tokensUsed = result.usageMetadata?.totalTokenCount ?? 500;

// Or using OpenRouter (access Claude, GPT-4, etc.):
const apiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "anthropic/claude-3-5-sonnet",
    messages: [
      { role: "system", content: `You are ${agent.displayName}, ${agent.role} in the COSMOS OS.` },
      { role: "user", content: task },
    ],
  }),
});
const data = await apiRes.json();
response = data.choices[0].message.content;
tokensUsed = data.usage?.total_tokens ?? 500;
```

---

## API Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/healthz` | — | Health check |
| `GET` | `/api/cosmos/status` | — | Captain Dashboard primary feed |
| `GET` | `/api/missions/active` | — | Active mission snapshot |
| `PATCH` | `/api/missions/active` | ✅ Supabase JWT | Update progress/status |
| `GET` | `/api/missions/grid-status` | — | Mission + agents + tokens |
| `GET` | `/api/agents` | — | List all agents |
| `GET` | `/api/agents/token-budget` | — | Token usage per agent |
| `GET` | `/api/agents/:id/status` | — | Single agent status |
| `POST` | `/api/agents/:id/dispatch` | ✅ Supabase JWT | Dispatch task to agent |

**Agent IDs:** `robin_vanguard`, `starlight`, `system`

**Captain Dashboard response contract:**
```json
{
  "active_mission": "Neural Localization",
  "progress": 65,
  "system_resonance": 100
}
```

---

## Local Development

```bash
# From repo root
cd packages/api
cp .env.example .env
# Fill in SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY

npm install
npm run dev
# → http://localhost:4000/api/healthz
```

---

## Production Checklist

- [ ] `CORS_ORIGIN` set to exact Vercel domain (not `*`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (never the anon key)
- [ ] `NODE_ENV=production` set
- [ ] Token limits tuned via `TOKEN_LIMIT_*` env vars
- [ ] LLM keys set: `GEMINI_API_KEY` / `ANTHROPIC_API_KEY`
- [ ] Replace mock `pickMockResponse()` in `neuralGrid.ts` with real agent calls
- [ ] Supabase RLS confirmed active on `user_data` table (already in `schema.sql`)
