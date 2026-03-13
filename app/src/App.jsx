import React, { useEffect, useState } from 'react';
import {
  getBalance,
  getStakedBalance,
  getPendingReward,
  invokeContract,
} from './lib/soroban';
import {
  isConnected as freighterIsConnected,
  getPublicKey as freighterGetPublicKey,
  setAllowed as freighterSetAllowed,
} from '@stellar/freighter-api';

const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || '';
const NETWORK_LABEL = 'Testnet';

function parseAmount(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (!/^[0-9]+$/.test(trimmed)) return null;
  const n = BigInt(trimmed);
  if (n <= 0n) return null;
  return n;
}

async function fetchPublicKey() {
  // Prefer the official Freighter API if available
  if (typeof freighterGetPublicKey === 'function') {
    return freighterGetPublicKey();
  }
  // Fallback to window.freighter for older Freighter versions
  if (typeof window !== 'undefined' && window.freighter?.getPublicKey) {
    return window.freighter.getPublicKey();
  }
  // No Freighter detected
  return null;
}

export default function App() {
  const [hasFreighter, setHasFreighter] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0n);
  const [stakedBalance, setStakedBalance] = useState(0n);
  const [pendingReward, setPendingReward] = useState(0n);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const [ready, setReady] = useState(false);

  async function refreshBalances(currentAddress = address) {
    if (!CONTRACT_ID || !currentAddress) return;
    setLoading(true);
    setError('');
    try {
      const [bal, staked, reward] = await Promise.all([
        getBalance(CONTRACT_ID, currentAddress),
        getStakedBalance(CONTRACT_ID, currentAddress),
        getPendingReward(CONTRACT_ID, currentAddress),
      ]);
      setBalance(bal);
      setStakedBalance(staked);
      setPendingReward(reward);
    } catch (e) {
      console.error(e);
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function connectWallet() {
    setError('');
    try {
      // Prompt Freighter to allow this site and return the user public key.
      await freighterSetAllowed();
      let pub = await fetchPublicKey();

      // If Freighter didn't return a key (or extension unsupported), fall back to manual entry
      if (!pub) {
        const manual = typeof window !== 'undefined'
          ? window.prompt(
              'Freighter did not return a public key.\n\nPaste your Stellar public key (G...) to continue:',
            )
          : null;

        // If the user cancels or pastes an invalid key, just show a friendly error
        // and keep the UI on the connect card instead of throwing.
        if (!manual || !/^G[A-Z0-9]{30,}$/.test(manual.trim())) {
          setError(
            'Could not get public key from Freighter. Please paste a valid Stellar public key starting with G...',
          );
          setConnected(false);
          return;
        }
        pub = manual.trim();
      }

      setAddress(pub);
      setConnected(true);
      await refreshBalances(pub);
    } catch (e) {
      console.error(e);
      setError(e?.message || String(e));
    }
  }

  async function handleStake() {
    const parsed = parseAmount(stakeAmount);
    if (parsed === null || !CONTRACT_ID || !address) {
      setError('Enter a positive whole-number amount to stake.');
      return;
    }
    setLoading(true);
    setError('');
    setTxHash('');
    try {
      const hash = await invokeContract(
        CONTRACT_ID,
        'stake',
        address,
        parsed.toString(),
      );
      setTxHash(hash);
      setStakeAmount('');
      await refreshBalances();
    } catch (e) {
      console.error(e);
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleUnstake() {
    const parsed = parseAmount(unstakeAmount);
    if (parsed === null || !CONTRACT_ID || !address) {
      setError('Enter a positive whole-number amount to unstake.');
      return;
    }
    setLoading(true);
    setError('');
    setTxHash('');
    try {
      const hash = await invokeContract(
        CONTRACT_ID,
        'unstake',
        address,
        parsed.toString(),
      );
      setTxHash(hash);
      setUnstakeAmount('');
      await refreshBalances();
    } catch (e) {
      console.error(e);
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') {
      setReady(true);
      return;
    }
    // Detect whether the Freighter extension is available and already connected.
    (async () => {
      try {
        const connected = await freighterIsConnected();
        setHasFreighter(true);
        if (connected) {
          const pub = await fetchPublicKey();
          if (pub) {
            setAddress(pub);
            setConnected(true);
            await refreshBalances(pub);
          }
        }
      } catch {
        // If the freighter-api call fails, extension is likely not installed.
        setHasFreighter(false);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Stake Token</h1>
        <p className="subtitle">
          DeFi staking on Stellar <span className="pill">{NETWORK_LABEL}</span> · 10% APY demo
        </p>
        {CONTRACT_ID && (
          <p className="contract">
            Contract: <code>{CONTRACT_ID.slice(0, 6)}…{CONTRACT_ID.slice(-6)}</code>
          </p>
        )}
      </header>

      {!ready ? (
        <section className="card connect">
          <p>Loading UI…</p>
        </section>
      ) : !connected ? (
        <section className="card connect">
          {!hasFreighter ? (
            <p>
              Freighter wallet is not detected. Install it from{' '}
              <a href="https://www.freighter.app/" target="_blank" rel="noreferrer">
                freighter.app
              </a>
              , switch to <strong>Testnet</strong>, then refresh this page.
            </p>
          ) : (
            <p>Connect your Freighter wallet to view balances and stake.</p>
          )}
          <button onClick={connectWallet} disabled={loading}>
            Connect Freighter
          </button>
          {error && <p className="error">{error}</p>}
        </section>
      ) : (
        <>
          <section className="card wallet">
            <p className="address">
              {address.slice(0, 12)}…{address.slice(-8)}
            </p>
            <button className="secondary" onClick={() => refreshBalances()} disabled={loading}>
              Refresh
            </button>
          </section>

          <section className="card balances">
            <h2>Balances</h2>
            <ul>
              <li>
                <strong>Balance</strong> <span>{balance.toString()}</span>
              </li>
              <li>
                <strong>Staked</strong> <span>{stakedBalance.toString()}</span>
              </li>
              <li>
                <strong>Pending reward</strong> <span>{pendingReward.toString()}</span>
              </li>
            </ul>
          </section>

          <section className="card actions">
            <h2>Stake</h2>
            <p>Lock tokens to earn ~10% APY. Rewards are paid on unstake.</p>
            <div className="row">
              <input
                type="text"
                placeholder="Amount"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                disabled={loading}
              />
              <button onClick={handleStake} disabled={loading || !stakeAmount}>
                Stake
              </button>
            </div>

            <h2>Unstake</h2>
            <p>Withdraw staked tokens and claim accrued rewards.</p>
            <div className="row">
              <input
                type="text"
                placeholder="Amount"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                disabled={loading}
              />
              <button onClick={handleUnstake} disabled={loading || !unstakeAmount}>
                Unstake
              </button>
            </div>
          </section>

          {error && <p className="error">{error}</p>}
          {txHash && (
            <p className="success">
              Tx:{' '}
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
              >
                {txHash.slice(0, 12)}…
              </a>
            </p>
          )}
        </>
      )}

      {!CONTRACT_ID && (
        <p className="hint">
          This is a demo staking dApp. To connect it to the blockchain, set{' '}
          <code>VITE_CONTRACT_ID</code> in <code>app/.env</code> to your deployed contract ID and
          restart <code>npm run dev</code>.
        </p>
      )}
    </div>
  );
}

