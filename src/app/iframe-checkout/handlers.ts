import { SafeAccountV0_3_0 as SafeAccount } from 'abstractionkit';
import CryptoJS from 'crypto-js';
import { Wallet } from 'ethers';
import type { NewCardPayment, BillingAddress } from './types';

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
 * Process payment using the created wallet and your payment API, matching the OnRampProcessSchema
 */
export async function processPaymentWithWallet(
  userEmail: string,
  userPhoneNumber: string,
  walletAddress: string,
  payment: any, // should match PaymentFlowSchema
  value: { currency: string; amount: number },
  createPaymentIntent?: boolean,
  clientRef?: string
) {
  const customer = {
    email: userEmail,
    phoneNumber: userPhoneNumber,
    walletAddress,
  };

  const body: any = {
    payment,
    customer,
    value,
  };
  if (createPaymentIntent !== undefined) body.createPaymentIntent = createPaymentIntent;
  if (clientRef !== undefined) body.clientRef = clientRef;

  const response = await fetch('http://localhost:8001/onramp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Payment failed: ${response.statusText}`);
  }

  return response.json();
}

// Helper to construct payment object from form data
export function buildNewCardPayment(
  card: { name: string; number: string; expiration: string; cvv: string },
  billingAddress: BillingAddress,
  saveCard?: boolean
): NewCardPayment {
  // Parse expiration (MM / YY or MM/YY)
  let month = 1;
  let year = new Date().getFullYear();
  const exp = card.expiration.replace(/\s/g, '');
  if (/^\d{2}\/\d{2,4}$/.test(exp)) {
    const [m, y] = exp.split('/');
    month = parseInt(m, 10);
    year = parseInt(y.length === 2 ? '20' + y : y, 10);
  } else if (/^\d{4}$/.test(exp)) {
    month = parseInt(exp.slice(0, 2), 10);
    year = parseInt('20' + exp.slice(2), 10);
  }

  return {
    method: 'CARD',
    ...(saveCard !== undefined ? { saveCard } : {}),
    card: {
      holderName: card.name,
      number: card.number.replace(/\s/g, ''),
      expiryDate: { month, year },
      cvc: card.cvv,
    },
    billingAddress,
  };
}
