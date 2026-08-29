<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Writing Style

- Follow the unslop skill rules for all prose, including agent output (chat replies, subagent and workflow reports); no em dashes. See `docs/agents/unslop.md` (vendored from github.com/cursor/plugins, skill "unslop").
- Exception: em dashes may remain in data files, third-party/vendored files, code that must match external text containing em dashes, and a lone "—" rendered as an empty-value placeholder in UI.

## Picking the right models for workflows and subagents

Rankings, higher = better. Cost reflects what I actually pay, not list price. Intelligence is how hard a problem you can hand the model unsupervised. Taste covers UI/UX, code quality, API design, and copy.

| model    | cost | intelligence | taste |
| -------- | ---- | ------------ | ----- |
| sonnet-5 | 5    | 5            | 7     |
| opus-5   | 4    | 7            | 8     |
| fable-5  | 2    | 9            | 9     |

How to apply:

- These are defaults, not limits. You have standing permission to override them: if a cheaper model's output doesn't meet the bar, rerun or redo the work with a smarter model without asking. Judge the output, not the price tag. Escalating costs less than shipping mediocre work.
- Cost is a tie-breaker only; when axes conflict for anything that ships, intelligence > taste > cost.
- Anything user-facing (UI, copy, API design) needs taste >= 7
- Reviews of plans/implementations: fable-5 or opus-5
- Never use Haiku.
- Claude models (sonnet-5, opus-5, fable-5) run via the Agent/Workflow model parameter
- ONLY USE SUBAGENTS IF IT IS NECESSARY
- If ONLY replacing characters, use the cheapest model in the table e.g. " - 'em dash' -> colon ':' "

## Commands

- NEVER RUN DEV SERVER
- Don't run dev server commands (e.g. `bun run dev`, `bun run dashboard:dev`, `bun run marketing:dev`) -> assume it's already running or ask the user.
- Don't run build commands unless specifically told to.
