#!/usr/bin/env bash
# start.sh — Install dependencies and start the OpenClaw Livestock Assistant API server.
# Usage: bash scripts/start.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$ROOT_DIR"

# ── 1. Verify Node.js is available ───────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo "❌  Node.js is required but not found. Install it from https://nodejs.org" >&2
  exit 1
fi

# ── 2. Verify at least one AI provider key is configured ─────────────────────
if [[ -z "${OPENAI_API_KEY:-}" && -z "${ANTHROPIC_API_KEY:-}" && -z "${GOOGLE_GENERATIVE_AI_API_KEY:-}" ]]; then
  echo "❌  No AI provider API key found." >&2
  echo "    Set at least one of:" >&2
  echo "      OPENAI_API_KEY            (OpenAI / GPT-5)" >&2
  echo "      ANTHROPIC_API_KEY         (Anthropic / Claude)" >&2
  echo "      GOOGLE_GENERATIVE_AI_API_KEY  (Google / Gemini)" >&2
  exit 1
fi

# ── 3. Install npm dependencies if needed ────────────────────────────────────
if [[ ! -d "$ROOT_DIR/node_modules" ]]; then
  echo "📦  Installing dependencies..."
  npm install --silent
fi

# ── 4. Start the server ───────────────────────────────────────────────────────
PORT="${PORT:-3000}"
echo "🐄  Starting OpenClaw Livestock Assistant on port $PORT..."
exec node -r ts-node/register src/index.ts
