# COSMOS — Straw Hat AI Crew Backend

> **Agentic OS backend** powering the Captain Dashboard on Vercel.
> Built on Node.js + Express + TypeScript inside a pnpm monorepo on Replit.

---

## Architecture Overview

```
Vercel Frontend (Captain Dashboard)
         │
         │  HTTPS / REST
         ▼
  Replit API Server  (/api/*)
         │
   ┌─────┴─────────────────────────┐
   │         COSMOS Core           │
   │                               │
   │  ┌─────────────┐              │
   │  │ Token Budget│◄─ tokenGuard │
   │  │  Tracker    │   middleware  │
   │  └──────┬──────┘              │
   │         │                     │
   │  ┌──────▼──────┐              │
   │  │ Neural Grid │  placeholder │
   │  │   Service   │  for LLM     │
   │  └──────┬──────┘  orchestration│
   │         │                     │
   │  ┌──────▼──────┐              │
   │  │   Agents    │              │
   │  │  Robin V.   │              │
   │  │  Starlight  │              │
   │  └─────────────┘              │
   └───────────────────────────────┘
```

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/healthz` | Server health check |
| `GET` | `/api/cosmos/status` | **Captain Dashboard feed** — mission + resonance |
| `GET` | `/api/missions/active` | Active mission snapshot |
| `PATCH` | `/api/missions/active` | Update mission progress / status |
| `GET` | `/api/missions/grid-status` | Full Neural Grid status |
| `GET` | `/api/agents` | List all COSMOS agents |
| `GET` | `/api/agents/token-budget` | Token budget for all agents |
| `GET` | `/api/agents/:agentId/status` | Single agent status |
| `POST` | `/api/agents/:agentId/dispatch` | Dispatch task to agent |

### Captain Dashboard contract

The `/api/cosmos/status` and `/api/missions/active` endpoints both return the
canonical shape the frontend expects:

```json
{
  "active_mission": "Neural Localization",
  "progress": 65,
  "system_resonance": 100
}
```

### Agent IDs

| ID | Display Name | Role |
|----|-------------|------|
| `robin_vanguard` | Robin Vanguard | Intelligence & Analysis |
| `starlight` | Starlight | Dimensional Navigator & Core Anchor |
| `system` | COSMOS System | Orchestration & Resource Management |

---

## Connecting to the Vercel Frontend

### Step 1 — Get your Replit backend URL

Your backend is publicly accessible at:

```
https://<your-replit-username>.<repl-name>.replit.app/api
```

To find the exact URL: open the Replit preview pane → copy the base URL → append `/api`.

You can verify with:
```bash
curl https://<your-repl-url>/api/cosmos/status
```

### Step 2 — Set the environment variable on Vercel

In your Vercel project → **Settings → Environment Variables**, add:

```
NEXT_PUBLIC_COSMOS_API_URL = https://<your-repl-url>/api
```

Or if you use a private variable (e.g. called from server-side):
```
COSMOS_API_URL = https://<your-repl-url>/api
```

### Step 3 — Call from your frontend

**React / Next.js example (client component):**
```typescript
const BASE = process.env.NEXT_PUBLIC_COSMOS_API_URL;

// Captain Dashboard feed
const res = await fetch(`${BASE}/cosmos/status`);
const data = await res.json();
// data.active_mission === "Neural Localization"
// data.progress === 65
// data.system_resonance === 100
```

**Dispatch a task to Robin Vanguard:**
```typescript
const res = await fetch(`${BASE}/agents/robin_vanguard/dispatch`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ task: "Analyze sector 7 anomalies" }),
});
const result = await res.json();
// result.response — agent's reply
// result.fallback — true if token budget was exhausted
```

**Poll mission progress:**
```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    const res = await fetch(`${BASE}/missions/active`);
    const mission = await res.json();
    setProgress(mission.progress);
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

### Step 4 — Handle CORS

The API server already enables CORS for all origins. If you need to restrict it to
your Vercel domain only, edit `artifacts/api-server/src/app.ts`:

```typescript
app.use(cors({ origin: "https://your-vercel-app.vercel.app" }));
```

---

## Token Budget & Rate Limiting

The `tokenGuard` middleware checks budget before every agent call. When a budget
drops below **2%**, the server returns a structured `503` with a cached fallback
so the dashboard never shows a blank state:

```json
{
  "error": "resource_constrained",
  "fallback": {
    "active_mission": "Neural Localization",
    "progress": 65,
    "system_resonance": 100,
    "note": "Cached snapshot — live data temporarily unavailable."
  }
}
```

Monitor budgets at `/api/agents/token-budget`. Refill is simulated every 5s in
dev — wire it to your real LLM billing window in production.

---

## Integrating a Real LLM

The `neuralGrid.dispatch()` method in `artifacts/api-server/src/services/neuralGrid.ts`
is the integration seam. Replace the mock section:

```typescript
// ── TODO: Replace with real LLM call ──────────────────
// LangChain example:
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

const llm = new ChatOpenAI({ model: "gpt-4o" });
const result = await llm.invoke([new HumanMessage(task)]);
response = result.content as string;
tokensUsed = result.usage_metadata?.total_tokens ?? 500;
// ──────────────────────────────────────────────────────
```

**AutoGen / multi-agent loop:** Point each agent's system prompt to `agentId`'s
`role` field, pass the task, and stream the result back through the same
`DispatchResult` shape.

---

## File Structure

```
artifacts/api-server/src/
├── app.ts                        # Express app setup, CORS, middleware
├── index.ts                      # Server entry point
├── lib/
│   └── logger.ts                 # Pino logger singleton
├── middlewares/
│   └── tokenGuard.ts             # Token budget check before agent routes
├── routes/
│   ├── index.ts                  # Route aggregator
│   ├── health.ts                 # GET /healthz
│   ├── cosmos.ts                 # GET /cosmos/status (Captain Dashboard)
│   ├── missions.ts               # GET|PATCH /missions/*
│   └── agents.ts                 # GET|POST /agents/*
└── services/
    ├── tokenBudget.ts            # Token tracker, queue, fallback
    └── neuralGrid.ts             # Neural Grid logic + agent state

lib/api-spec/openapi.yaml         # OpenAPI contract (source of truth)
lib/api-client-react/             # Generated React Query hooks (from codegen)
lib/api-zod/                      # Generated Zod schemas (from codegen)
```

---

## Local Development

```bash
# Run the API server (auto-restarts on file change)
pnpm --filter @workspace/api-server run dev

# Regenerate API hooks + Zod schemas after changing openapi.yaml
pnpm --filter @workspace/api-spec run codegen

# Typecheck everything
pnpm run typecheck
```

The server runs on the port Replit assigns — access it via the shared proxy at
`localhost:80/api/*` from other services, or at your public Replit URL externally.

---

## Roadmap

- [ ] Swap mock `pickMockResponse()` with real LLM (LangChain / AutoGen)
- [ ] Persist mission state to PostgreSQL (Drizzle schema in `lib/db/`)
- [ ] Add WebSocket channel for real-time dashboard updates
- [ ] Wire token refill to actual LLM billing window API
- [ ] Add authentication (Replit Auth or Clerk) to protect dispatch endpoints
- [ ] Stream agent responses via Server-Sent Events (SSE)
