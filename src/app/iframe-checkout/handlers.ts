// @ts-expect-error: candide-sdk may not have type declarations
import { Candide } from 'candide-sdk';
import CryptoJS from 'crypto-js';

// Placeholder password for encryption. Replace with user input for production.
const ENCRYPTION_PASSWORD = 'replace-with-user-password';

/**
 * Creates a Candide wallet, encrypts the private key, and stores it in localStorage.
 * Returns the wallet address.
 */
export async function createAndStoreWallet() {
  // 1. Create wallet
  const wallet = await Candide.Wallet.create();
  const privateKey = wallet.privateKey;
  const address = wallet.address;

  // 2. Encrypt private key
  const encryptedKey = CryptoJS.AES.encrypt(privateKey, ENCRYPTION_PASSWORD).toString();

  // 3. Store in localStorage
  localStorage.setItem('encrypted_wallet_key', encryptedKey);
  localStorage.setItem('wallet_address', address);

  return address;
}
