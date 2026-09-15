#!/bin/zsh
# usage: run.sh <name> <prompt-file> [resume-session-id]
set -e
KIT=/Users/sungjae-cha/Documents/research-agent/workspace/lecture_20260915/practice_kit/my-career
OUT=/Users/sungjae-cha/Documents/research-agent/workspace/lecture_20260915/practice_runs
NAME=$1; PROMPT=$(cat "$2"); RESUME=$3
cd "$KIT"
ARGS=(-p --model claude-fable-5-1 --effort high --permission-mode acceptEdits --output-format json --max-budget-usd 6)
if [ -n "$RESUME" ]; then ARGS+=(--resume "$RESUME"); fi
env -u CLAUDECODE -u CLAUDE_CODE_ENTRYPOINT CLAUDE_CODE_EFFORT_LEVEL=high "$HOME/Library/Application Support/Claude/claude-code/2.1.270/claude.app/Contents/MacOS/claude" "${ARGS[@]}" "$PROMPT" > "$OUT/$NAME.json" 2> "$OUT/$NAME.err"
echo "exit=$? name=$NAME"; head -c 400 "$OUT/$NAME.json"; echo
