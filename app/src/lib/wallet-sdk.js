/**
 * Optional Stellar TypeScript Wallet SDK helpers (Horizon / testnet funding).
 * Uses direct Friendbot when SDK fails (e.g. 400).
 *
 * @see https://github.com/stellar/typescript-wallet-sdk
 * @see https://developers.stellar.org/docs/tutorials/create-account
 */

const FRIENDBOT_URL = 'https://friendbot.stellar.org';

/**
 * Fund a Stellar testnet account via the public Friendbot (GET request).
 * Works without the Wallet SDK and avoids 400 from SDK-based funding.
 * @param {string} publicKey - G... address to fund
 * @returns {Promise<void>}
 */
async function fundViaFriendbot(publicKey) {
  const url = `${FRIENDBOT_URL}/?addr=${encodeURIComponent(publicKey)}`;
  const res = await fetch(url);
  const text = await res.text();
  const data = (() => {
    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
  })();
  const detail = (data.detail && typeof data.detail === 'string' ? data.detail : '').toLowerCase();
  if (res.ok) return;
  if (res.status === 400 && (detail.includes('already funded') || detail.includes('account already funded'))) {
    return; // already funded = success, no error
  }
  throw new Error(`Friendbot failed (${res.status}): ${text || res.statusText}`);
}

/**
 * Fund a Stellar testnet account. Tries Wallet SDK first, then public Friendbot.
 * @param {string} publicKey - G... address to fund
 * @returns {Promise<void>}
 * @throws {Error} if funding fails
 */
export async function fundTestnetAccount(publicKey) {
  if (!publicKey || !/^G[A-Z0-9]{55}$/.test(publicKey)) {
    throw new Error('Invalid Stellar public key (expected G...)');
  }
  try {
    const sdk = await import('@stellar/typescript-wallet-sdk');
    let wallet;
    if (typeof sdk.Wallet?.TestNet === 'function') {
      wallet = sdk.Wallet.TestNet();
    } else if (sdk.Wallet && sdk.StellarConfiguration) {
      const config = sdk.StellarConfiguration.Testnet?.() ?? sdk.StellarConfiguration.TestNet?.();
      wallet = config ? new sdk.Wallet(config) : null;
    }
    if (wallet) {
      const stellar = wallet.stellar();
      if (typeof stellar?.fundTestnetAccount === 'function') {
        await stellar.fundTestnetAccount(publicKey);
        return;
      }
    }
  } catch (e) {
    if (e?.message && e.message.includes('Invalid Stellar public key')) throw e;
  }
  await fundViaFriendbot(publicKey);
}

/**
 * Check if the Wallet SDK is available (for conditional UI).
 * @returns {Promise<boolean>}
 */
export async function isWalletSdkAvailable() {
  try {
    await import('@stellar/typescript-wallet-sdk');
    return true;
  } catch {
    return false;
  }
}
