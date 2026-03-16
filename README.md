## Hello World — Soroban (Rust) + React

This repo is a **minimal Soroban “Hello World”** example:

- **Contract:** `contracts/hello_world` — `hello(env, to: String) -> Vec<String>` returns `["Hello", to]`.
- **App:** `app/` — React + Vite UI that calls `hello` and displays the greeting.

---

## 1. Prerequisites

- **Rust** (stable, 1.84+ recommended)
- **WASM target**:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup default stable
rustup target add wasm32-unknown-unknown
```

- **Stellar CLI:**

```bash
brew install stellar-cli
```

- **Soroban CLI:**

```bash
cargo install --locked soroban-cli
```

- **Node.js** (LTS) and **npm**
- **Freighter** browser extension, set to **Testnet**

Configure Soroban Testnet (one time):

```bash
soroban network add \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  testnet
```

---

## 2. Hello World contract

Location: `contracts/hello_world/`

`src/lib.rs`:

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, vec, Env, String, Vec};

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn hello(env: Env, to: String) -> Vec<String> {
        vec![&env, String::from_str(&env, "Hello"), to]
    }
}

mod test;
```

Run tests:

```bash
cd soroban-smart-contract
cargo test -p hello-world
```

---

## 3. Build the contract

From the repo root:

```bash
cd soroban-smart-contract

cargo build --release -p hello-world --target wasm32-unknown-unknown
```

This produces:

- `target/wasm32-unknown-unknown/release/hello_world.wasm`

---

## 4. Create a testnet identity

Use Stellar CLI to create an identity (e.g. `alice`) funded on Testnet:

```bash
stellar keys generate alice --network testnet --fund

# optional: inspect keys
stellar keys ls
stellar keys address alice
```

---

## 5. Deploy the contract to Testnet

From the repo root:

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/hello_world.wasm \
  --source-account alice \
  --network testnet
```

Note the printed **contract ID** (starts with `C...`).

---

## 6. Configure the React app

In `app/.env`:

```env
VITE_CONTRACT_ID=YOUR_HELLO_WORLD_CONTRACT_ID
```

Use the exact `C...` you got from the deploy command.

---

## 7. Run the UI

From the `app` directory:

```bash
cd soroban-smart-contract/app

npm install        # first time only
npm run dev
```

Open the printed URL (usually `http://localhost:5173`) in your browser.

- Ensure **Freighter is set to Testnet**.
- Enter a name in the input field.
- Click **“Say hello”** — the app will call `hello(name)` on your contract and display the greeting.

---

## 8. Files overview

- **Root**
  - `Cargo.toml` — workspace configuration, shared `soroban-sdk` dependency.
  - `README.md` — this file.
- **Contract**
  - `contracts/hello_world/Cargo.toml` — contract package config.
  - `contracts/hello_world/src/lib.rs` — contract implementation.
  - `contracts/hello_world/src/test.rs` — unit tests.
- **Frontend**
  - `app/src/App.jsx` — Hello World UI.
  - `app/src/lib/soroban.js` — `helloView` helper (calls `hello(name)` via Soroban RPC).
  - `app/.env` — `VITE_CONTRACT_ID` for the deployed contract.

---

## 9. Troubleshooting

- **`Failed to find config identity for alice`**  
  Run `stellar keys generate alice --network testnet --fund` and try deploy again.

- **Simulation warnings like `Simulation identified as read-only`**  
  This is expected for `hello`: it’s a read-only contract. The CLI simulates instead of submitting a transaction; the result you see is already the correct output.

- **Freighter “wrong network” errors**  
  Make sure Freighter is set to **Testnet**, not Mainnet, and reload the page.

## Hello World — Soroban (Rust) + React

This repo is a **minimal Soroban “Hello World”** example:

- **Contract:** `contracts/hello_world` — `hello(env, to: String) -> Vec<String>` returns `["Hello", to]`.
- **App:** `app/` — React + Vite UI that calls `hello` and displays the greeting.

---

## 1. Prerequisites

- **Rust** (stable, 1.84+ recommended)
- **WASM target**:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup default stable
rustup target add wasm32-unknown-unknown
```

- **Stellar CLI:**

```bash
brew install stellar-cli
```

- **Soroban CLI:**

```bash
cargo install --locked soroban-cli
```

- **Node.js** (LTS) and **npm**
- **Freighter** browser extension, set to **Testnet**

Configure Soroban Testnet (one time):

```bash
soroban network add \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" \
  testnet
```

---

## 2. Hello World contract

Location: `contracts/hello_world/`

`src/lib.rs`:

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, vec, Env, String, Vec};

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn hello(env: Env, to: String) -> Vec<String> {
        vec![&env, String::from_str(&env, "Hello"), to]
    }
}

mod test;
```

Run tests:

```bash
cd /Users/armielynobinguar/soroban-smart-contract
cargo test -p hello-world
```

---

## 3. Build the contract

From the repo root:

```bash
cd /Users/armielynobinguar/soroban-smart-contract

cargo build --release -p hello-world --target wasm32-unknown-unknown
```

This produces:

- `target/wasm32-unknown-unknown/release/hello_world.wasm`

---

## 4. Create a testnet identity

Use Stellar CLI to create an identity (e.g. `alice`) funded on Testnet:

```bash
stellar keys generate alice --network testnet --fund

# optional: inspect keys
stellar keys ls
stellar keys address alice
```

---

## 5. Deploy the contract to Testnet

From the repo root:

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/hello_world.wasm \
  --source-account alice \
  --network testnet
```

Note the printed **contract ID** (starts with `C...`).

---

## 6. Configure the React app

In `app/.env`:

```env
VITE_CONTRACT_ID=YOUR_HELLO_WORLD_CONTRACT_ID
```

Use the exact `C...` you got from the deploy command.

---

## 7. Run the UI

From the `app` directory:

```bash
cd /Users/armielynobinguar/soroban-smart-contract/app

npm install        # first time only
npm run dev
```

Open the printed URL (usually `http://localhost:5173`) in your browser.

- Ensure **Freighter is set to Testnet**.
- Enter a name in the input field.
- Click **“Say hello”** — the app will call `hello(name)` on your contract and display the greeting.

---

## 8. Files overview

- **Root**
  - `Cargo.toml` — workspace configuration, shared `soroban-sdk` dependency.
  - `README.md` — this file.
- **Contract**
  - `contracts/hello_world/Cargo.toml` — contract package config.
  - `contracts/hello_world/src/lib.rs` — contract implementation.
  - `contracts/hello_world/src/test.rs` — unit tests.
- **Frontend**
  - `app/src/App.jsx` — Hello World UI.
  - `app/src/lib/soroban.js` — `helloView` helper (calls `hello(name)` via Soroban RPC).
  - `app/.env` — `VITE_CONTRACT_ID` for the deployed contract.

---

## 9. Troubleshooting

- **`Failed to find config identity for alice`**  
  Run `stellar keys generate alice --network testnet --fund` and try deploy again.

- **Simulation warnings like `Simulation identified as read-only`**  
  This is expected for `hello`: it’s a read-only contract. The CLI simulates instead of submitting a transaction; the result you see is already the correct output.

- **Freighter “wrong network” errors**  
  Make sure Freighter is set to **Testnet**, not Mainnet, and reload the page.

## Donation Pool — Soroban (Rust) + React

A **beginner‑friendly** Soroban (Stellar) project: one donation‑pool contract and one React app.

- **Contract:** `contracts/donation_pool` — `donate`, `total_donated`, `donated(addr)`.
- **App:** `app/` — React + Vite UI to connect Freighter and record donations, showing a simple leaderboard.

---

## Step‑by‑step: from zero to UI

Follow these steps in order.

### 1. Install prerequisites

- **Rust** (stable) and WASM target:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup default stable
rustup target add wasm32-unknown-unknown
```

- **Stellar CLI** (used for deploy/invoke):

```bash
brew install stellar-cli
```

- **Soroban CLI** (only needed to register the testnet RPC endpoint; optional if you already have it):

```bash
cargo install --locked soroban-cli
```

- **Node.js** (LTS) and **npm**.
- **Freighter** browser extension, with **Network → Testnet**.

### 2. Add Soroban Testnet network (one time)

This is done with the Soroban CLI:

```bash
soroban network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

### 3. Build the donation pool contract

From the repo root:

```bash
cd /Users/armielynobinguar/soroban-smart-contract

cargo build --release -p donation-pool --target wasm32-unknown-unknown
```

This produces:

- `target/wasm32-unknown-unknown/release/donation_pool.wasm`

### 4. Create an `admin` identity on testnet (one time)

Use Stellar CLI:

```bash
stellar keys generate admin --network testnet --fund
```

If it says **“An identity with the name 'admin' already exists”**, you are fine; it’s already there.

You can see your identities and admin public key:

```bash
stellar keys ls
stellar keys public-key admin
```

Note the `admin` public key (a `G...` string). Example:

- `GCFQ3BAF5OTQTVD7XCYQSDET454R4L2QJF6KPAOKFRR4234UPQ5WXXGC`

### 5. Deploy the contract

Still from the repo root:

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/donation_pool.wasm \
  --source-account admin \
  --network testnet
```

In the output, copy the **contract ID** starting with `C...` (for example, `CBB...`).

### 6. Initialize the contract (`init --admin`)

Use the `admin` public key from step 4 and the `C...` from step 5:

```bash
stellar contract invoke \
  --id CCODK7IDDV2NOUZVGEIOS5SQLKC5N4L3N6SVYECSNMW4CBGEKEJJVV5W \
  --source-account admin \
  --network testnet \
  -- init \
  --admin GCFQ3BAF5OTQTVD7XCYQSDET454R4L2QJF6KPAOKFRR4234UPQ5WXXGC
```

Replace with your own values if you redeploy:

- `--id …` should be your **donation_pool** contract ID (`C...`).
- `--admin …` should be your `admin` public key (`G...`).

### 7. Configure the React app

In the `app` directory:

```bash
cd /Users/armielynobinguar/soroban-smart-contract/app

cp .env.example .env   # if you haven’t already
```

Edit `.env` and set:

```env
VITE_CONTRACT_ID=CONTRACT_ID
```

Use the same `CONTRACT_ID` from step 5.

### 8. Run the UI

From the `app` directory:

```bash
npm install        # first time only
npm run dev
```

Open the printed URL (usually `http://localhost:5173`) in your browser:

Connect Freighter on **Testnet**, click **Connect**, then **Donate** and **Refresh** to see:

- Your total donated amount.
- The total donated by all addresses.

---

## Contract details

- **Location:** `contracts/donation_pool/`
- **Interface:**
  - `init()`
  - `donate(from: Address, amount: i128)`
  - `total_donated() -> i128`
  - `donated(addr: Address) -> i128`
- **Tests:**

```bash
cargo test -p donation-pool
```

---

## App details

- **Location:** `app/`
- **Tech:** React, Vite, `@stellar/stellar-sdk`, `@stellar/freighter-api`.
- **Config:** `.env` → `VITE_CONTRACT_ID=<your C... donation pool id>`.
- **Scripts** (run from `app/`):
  - `npm run dev` — start dev server.
  - `npm run build` — production build.
  - `npm run preview` — preview production build.

---

## Optional: Wallet SDK

The app talks to Soroban via `@stellar/stellar-sdk` and Freighter.  
Optionally, you can also use `@stellar/typescript-wallet-sdk` for **Horizon** things (e.g. funding testnet accounts); see `app/src/lib/wallet-sdk.js` for a usage example.

