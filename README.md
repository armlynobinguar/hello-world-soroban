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

