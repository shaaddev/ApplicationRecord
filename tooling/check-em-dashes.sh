#!/usr/bin/env bash
# Fails when a diff adds em dashes to prose or code.
# Rule source: AGENTS.md "Writing Style" (docs/agents/unslop.md).
#
# Usage: tooling/check-em-dashes.sh <base-sha> [head-sha]
#
# Only added lines are inspected, so existing text is never flagged.
# Exempt (per AGENTS.md): vendored/third-party files, data files, and a
# lone "—" used as an empty-value placeholder in UI (e.g. ">—<" or '"—"').
set -euo pipefail

base="${1:?usage: $0 <base-sha> [head-sha]}"
head="${2:-HEAD}"

exempt='^(\.agents/|docs/agents/unslop\.md|db/migrations/|kinde_export/|public/|pnpm-lock\.yaml$|tooling/check-em-dashes\.sh$|.*\.(json|csv|sql)$)'

git diff -U0 --diff-filter=AM "$base...$head" -- . | awk -v exempt="$exempt" '
  BEGIN {
    dash = "\342\200\224"
    placeholder = "[\"'\''>{`][ \t]*" dash "[ \t]*[\"'\''<}`]"
    bad = 0
  }
  /^diff --git/ { file = ""; skip = 0; next }
  /^\+\+\+ /    { file = substr($0, 7); skip = (file ~ exempt); next }
  /^@@/         { match($0, /\+[0-9]+/); line = substr($0, RSTART + 1, RLENGTH - 1) + 0; next }
  skip          { next }
  /^\+/ {
    if (index($0, dash) && $0 !~ placeholder) {
      printf "::error file=%s,line=%d::em dash added. Use a colon, comma, or period instead (AGENTS.md > Writing Style).\n", file, line
      bad = 1
    }
    line++
  }
  END {
    if (bad) exit 1
    print "no em dashes added"
  }
'
