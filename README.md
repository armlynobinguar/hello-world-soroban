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

Deploy uses the identity **`alice`**. Create and fund it if you don’t have it yet.

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

## Deploy the contract (Testnet)

From the **repo root** (`soroban-smart-contract`).

### Option A — script (macOS/Linux)

```bash
chmod +x scripts/deploy-hello-world-testnet.sh
./scripts/deploy-hello-world-testnet.sh
```

The script builds `hello_world.wasm`, runs `stellar contract deploy`, then prints your **`C...` contract ID** and a sample `invoke` command.

### Option B — manual commands

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

### Verify deployment (CLI)

Replace `YOUR_CONTRACT_ID` with your `C...` ID:

```bash
stellar contract invoke \
  --id YOUR_CONTRACT_ID \
  --source-account alice \
  --network testnet \
  -- hello \
  --to World
```

You should see a result like `Hello` and `World` (contract returns a vector of strings).

---

## UI: run the app

1. Copy env template and set your deployed ID (from **repo root**):

   ```bash
   cp app/.env.example app/.env
   ```

   Edit `app/.env` and set your contract ID:

   ```env
   VITE_CONTRACT_ID=CCO5W5XXD6QLTGTDJXRX4ZCUH666DHWMK34KIP5ZUO5V7DVYDMBX5RIZ
   ```
   (Use your own `C...` ID from deploy if different.)

2. Start the UI — from **repo root** run `cd app`, then:

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

**Note:** Use `cd app` only. If you are already inside the repo (e.g. your prompt shows `soroban-smart-contract %`), do **not** run `cd soroban-smart-contract/app` (that path is for when you're in the parent folder).

Open the printed URL (usually `http://localhost:5173`) and click **Say hello**.

---

## Troubleshooting

- **`Failed to find config identity for alice`**
  - Run `stellar keys generate alice --network testnet --fund`, then deploy again.

- **Freighter “wrong network”**
  - Ensure Freighter is set to **Testnet**, then reload the page.

- **Deploy fails (insufficient balance / RPC errors)**
  - Confirm `alice` is funded: `stellar keys address alice` and use a [Stellar testnet friendbot](https://laboratory.stellar.org/#account-creator?network=test) if needed.

- **`cd: no such file or directory: soroban-smart-contract/app`** or **`Missing script: "dev"`**
  - You're already in the repo root. Use `cd app` (not `cd soroban-smart-contract/app`), then run `npm install` and `npm run dev`.
