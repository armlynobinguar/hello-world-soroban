import React, { useState } from 'react';
import { helloView } from './lib/soroban';

const INITIAL_CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || '';
const NETWORK_LABEL = 'Testnet';

export default function App() {
  const [contractId, setContractId] = useState(INITIAL_CONTRACT_ID);
  const [name, setName] = useState('World');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function ensureContractId() {
    if (contractId) return contractId;
    const manual = typeof window !== 'undefined'
      ? window.prompt('Paste your contract ID (starts with C...):')
      : null;
    if (!manual || !/^C[A-Z0-9]{30,}$/.test(manual.trim())) {
      setError('Valid contract ID (C...) required.');
      return null;
    }
    setContractId(manual.trim());
    return manual.trim();
  }

  async function handleHello() {
    setError('');
    setResult('');
    const id = ensureContractId();
    if (!id) return;
    if (!name.trim()) {
      setError('Enter a name.');
      return;
    }
    setLoading(true);
    try {
      const res = await helloView(id, name.trim());
      setResult(res);
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Hello World</h1>
        <p className="subtitle">
          Simple Soroban contract on <span className="pill">{NETWORK_LABEL}</span>
        </p>
        {contractId && (
          <p className="contract">
            Contract: <code>{contractId.slice(0, 8)}…{contractId.slice(-6)}</code>
            <button
              type="button"
              className="secondary"
              style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}
              onClick={() => {
                const id = window.prompt('Contract ID (C...)', contractId);
                if (id && /^C[A-Z0-9]{30,}$/.test(id.trim())) setContractId(id.trim()), setError('');
              }}
            >
              Change
            </button>
          </p>
        )}
      </header>

      <section className="card">
        <h2>Say hello</h2>
        <p>Calls <code>hello(name: Symbol) -&gt; Symbol</code> on your contract.</p>
        <div className="row">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleHello} disabled={loading}>
            {loading ? 'Calling…' : 'Say hello'}
          </button>
        </div>
        {result && <p className="success">Result: {result}</p>}
        {error && <p className="error" role="alert">{error}</p>}
      </section>
    </div>
  );
}
