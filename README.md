## Hello World — Soroban (Rust) + React (Vite)

Minimal Soroban “Hello World” project:

- **Contract:** `contracts/hello_world` — `hello(env, to: String) -> Vec<String>` returns `["Hello", to]`.
- **UI:** `app/` — React + Vite app that calls `hello` and displays the greeting.

---

## Step-by-step (macOS/Linux + Windows)

### 1) Prerequisites

- Rust (stable) + `wasm32-unknown-unknown` target
- Node.js (LTS) + npm
- Freighter wallet (Network → **Testnet**)
- Stellar CLI (`stellar`)
- Soroban CLI (`soroban`)

#### macOS/Linux

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup default stable
rustup target add wasm32-unknown-unknown

brew install stellar-cli
cargo install --locked soroban-cli
```

#### Windows (PowerShell)

Install Rust: `https://rustup.rs/` (restart PowerShell after install), then:

```powershell
rustup default stable
rustup target add wasm32-unknown-unknown

# Install Stellar CLI (Windows): https://github.com/stellar/stellar-cli
cargo install --locked soroban-cli
```

---

### 2) Configure Soroban Testnet (one time)

#### macOS/Linux

```bash
soroban network add \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  testnet
```

#### Windows (PowerShell)

```powershell
soroban network add `
  --rpc-url https://soroban-testnet.stellar.org:443 `
  --network-passphrase "Test SDF Network ; September 2015" `
  testnet
```

---

### 3) Create a funded Testnet identity (one time)

#### macOS/Linux

```bash
stellar keys generate alice --network testnet --fund
stellar keys ls
stellar keys address alice
```

#### Windows (PowerShell)

```powershell
stellar keys generate alice --network testnet --fund
stellar keys ls
stellar keys address alice
```

---

## Contract: build, test, deploy

From the repo root (`soroban-smart-contract`):

#### macOS/Linux

```bash
cargo test -p hello-world
cargo build --release -p hello-world --target wasm32-unknown-unknown

stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/hello_world.wasm \
  --source-account alice \
  --network testnet
```

#### Windows (PowerShell)

```powershell
cargo test -p hello-world
cargo build --release -p hello-world --target wasm32-unknown-unknown

stellar contract deploy `
  --wasm target/wasm32-unknown-unknown/release/hello_world.wasm `
  --source-account alice `
  --network testnet
```

Copy the printed **contract ID** (starts with `C...`).

---

## UI: run the app

1) Set `app/.env`:

```env
VITE_CONTRACT_ID=YOUR_HELLO_WORLD_CONTRACT_ID
```

2) Start the UI:

#### macOS/Linux

```bash
cd app
npm install
npm run dev
```

#### Windows (PowerShell)

```powershell
cd app
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`) and click **Say hello**.

---

## Troubleshooting

- **`Failed to find config identity for alice`**
  - Run `stellar keys generate alice --network testnet --fund`, then redeploy.

- **Freighter “wrong network”**
  - Ensure Freighter is set to **Testnet**, then reload the page.

