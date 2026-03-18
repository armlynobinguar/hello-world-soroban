#!/usr/bin/env bash
# Build hello_world WASM and deploy to Stellar Testnet.
# Prerequisites: Rust + wasm32-unknown-unknown, stellar CLI, identity `alice` funded on testnet.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> Building hello_world.wasm..."
cargo build --release -p hello-world --target wasm32-unknown-unknown

WASM="target/wasm32-unknown-unknown/release/hello_world.wasm"
if [[ ! -f "$WASM" ]]; then
  echo "error: expected $WASM" >&2
  exit 1
fi

echo "==> Deploying to testnet (source: alice)..."
DEPLOY_OUT="$(stellar contract deploy \
  --wasm "$WASM" \
  --source-account alice \
  --network testnet 2>&1)"
echo "$DEPLOY_OUT"
# Contract IDs on testnet are 56-character strings starting with C
CONTRACT_ID="$(echo "$DEPLOY_OUT" | grep -oE 'C[0-9A-Z]{55}' | tail -1)"
if [[ -z "$CONTRACT_ID" ]]; then
  echo "" >&2
  echo "Could not parse contract ID from output. Copy the C... ID from above into app/.env" >&2
  exit 1
fi

echo ""
echo "Deployed contract ID:"
echo "  $CONTRACT_ID"
echo ""
echo "Verify (CLI):"
echo "  stellar contract invoke --id $CONTRACT_ID --source-account alice --network testnet -- hello --to World"
echo ""
echo "UI: copy to app/.env"
echo "  VITE_CONTRACT_ID=$CONTRACT_ID"
