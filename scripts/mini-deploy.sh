#!/bin/bash
# launchd spouští kontrolu main každých pět minut.
set -euo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
BASE="$HOME/Library/Application Support/Trips"
REPO="$BASE/repo"
mkdir -p "$BASE"
if [ ! -d "$REPO/.git" ]; then
  [ ! -e "$REPO" ] || exit 1
  git -c credential.helper='!gh auth git-credential' clone --no-checkout \
    https://github.com/humlmartin/trips.git "$REPO"
  touch "$REPO/.git/trips-mini"
fi
[ -f "$REPO/.git/trips-mini" ] || exit 1
cd "$REPO"
git -c credential.helper='!gh auth git-credential' fetch -q origin main
SHA="$(git rev-parse origin/main)"
if [ -f "$BASE/deployed-sha" ] && [ "$(cat "$BASE/deployed-sha")" = "$SHA" ]; then
  exit 0
fi
git diff --quiet
git diff --cached --quiet
git checkout -q --detach "$SHA"
docker compose -f docker-compose.mini.yml up -d --build
printf '%s\n' "$SHA" > "$BASE/deployed-sha"
