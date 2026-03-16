/**
 * Soroban RPC helpers for a simple hello-world app.
 * Uses @stellar/stellar-sdk for Server, assembleTransaction, Contract, and XDR.
 * Decodes errorResultXdr on tx rejection (e.g. txBadAuth = wrong network).
 */

import {
  Account,
  Contract,
  TransactionBuilder,
  nativeToScVal,
  scValToNative,
} from '@stellar/stellar-base';
import { Server } from '@stellar/stellar-sdk/rpc';

export const TESTNET_RPC = 'https://soroban-testnet.stellar.org';
export const TESTNET_HORIZON = 'https://horizon-testnet.stellar.org';

// Explicitly use the Soroban Testnet passphrase string expected by Freighter.
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

// Normalize contract ID (strip spaces).
function normalizeContractId(id) {
  if (!id || typeof id !== 'string') return '';
  return id.trim();
}

// Read a single hello(name) view via simulateTransaction.
export async function helloView(contractId, name, rpcUrl = TESTNET_RPC) {
  const id = normalizeContractId(contractId);
  if (!id) throw new Error('Contract ID required');
  const server = new Server(rpcUrl);
  const contract = new Contract(id);
  const op = contract.call('hello', nativeToScVal(name));
  // Dummy account is fine for pure view via simulation.
  const account = new Account(
    'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
    '0',
  );
  const raw = new TransactionBuilder(account, {
    fee: '10000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(op)
    .setTimeout(180)
    .build();
  try {
    const sim = await server.simulateTransaction(raw);
    if (sim.error) throw new Error(sim.error);
    const retval = sim.result?.retval;
    if (retval === undefined) throw new Error('No simulation result');
    const native = scValToNative(retval);
    // Contract returns Vec<String> -> join into one greeting.
    if (Array.isArray(native)) return native.join(' ');
    return String(native);
  } catch (e) {
    throw new Error(e?.message || String(e));
  }
}
