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

