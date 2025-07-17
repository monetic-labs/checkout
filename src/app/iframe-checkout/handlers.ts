import { SafeAccountV0_3_0 as SafeAccount } from 'abstractionkit';
import CryptoJS from 'crypto-js';
import { Wallet } from 'ethers';

// Placeholder password for encryption. Replace with user input for production.
const ENCRYPTION_PASSWORD = 'replace-with-user-password';

/**
 * Check if a wallet already exists for the given email
 */
export function getExistingWallet(email: string): string | null {
  const storedEmail = localStorage.getItem('user_email');
  const storedWalletAddress = localStorage.getItem('wallet_address');
  
  if (storedEmail === email && storedWalletAddress) {
    return storedWalletAddress;
  }
  
  return null;
}

/**
 * Creates a Candide SafeAccount for the user, encrypts the private key, and stores it in localStorage.
 * The wallet will be linked to the user's email in your backend system.
 * Returns the wallet address.
 */
export async function createAndStoreWallet(userEmail: string) {
  // Check if wallet already exists for this email
  const existingWallet = getExistingWallet(userEmail);
  if (existingWallet) {
    console.log('Wallet already exists for this email:', existingWallet);
    return existingWallet;
  }

  // 1. Generate a new Ethereum wallet
  const wallet = Wallet.createRandom();
  const privateKey = wallet.privateKey;
  const address = wallet.address;

  // 2. Create SafeAccount instance with the public address
  const account = SafeAccount.initializeNewAccount([address]);
  const safeAddress = account.accountAddress;

  // 3. Encrypt private key
  const encryptedKey = CryptoJS.AES.encrypt(privateKey, ENCRYPTION_PASSWORD).toString();

  // 4. Store in localStorage
  localStorage.setItem('encrypted_wallet_key', encryptedKey);
  localStorage.setItem('wallet_address', safeAddress);
  localStorage.setItem('user_email', userEmail);

  return safeAddress;
}

/**
 * Process payment using the created wallet and your payment API
 */
export async function processPaymentWithWallet(
  userEmail: string, 
  walletAddress: string, 
  paymentAmount: number,
  paymentDetails: any
) {
  // TODO: Replace with your actual payment API endpoint
  const response = await fetch('/api/process-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userEmail,
      walletAddress,
      amount: paymentAmount,
      paymentDetails,
    }),
  });

  if (!response.ok) {
    throw new Error(`Payment failed: ${response.statusText}`);
  }

  return response.json();
}
