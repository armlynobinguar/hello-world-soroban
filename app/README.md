# Simple Token dApp (React + Vite)

Front end for the **simple token** contract. Connect Freighter (testnet), view balance, and use Transfer or Mint.

## Setup

1. Deploy the contract and set the contract ID (see repo root [README](../README.md)).
2. Copy env example and set your contract ID:
   ```bash
   cp .env.example .env
   # Edit .env: VITE_CONTRACT_ID=C...
   ```
3. Install and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the URL (e.g. http://localhost:5173), install [Freighter](https://www.freighter.app/) if needed, switch to **testnet**, then connect wallet.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
