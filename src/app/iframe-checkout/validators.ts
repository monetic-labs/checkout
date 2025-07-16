import cardValidator from "card-validator";

export function validateIframeCheckout({
  email,
  cardNumber,
  expiry,
  cvc,
  address,
}: {
  email: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  address: string;
}): string | null {
  // Simple email regex
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!email || !cardNumber || !expiry || !cvc || !address) {
    return "Please fill in all fields.";
  }
  if (!validateEmail(email)) {
    return "Please enter a valid email address.";
  }
  const cardNumberValidation = cardValidator.number(cardNumber);
  if (!cardNumberValidation.isValid) {
    return "Please enter a valid card number.";
  }
  const expiryValidation = cardValidator.expirationDate(expiry);
  if (!expiryValidation.isValid) {
    return "Please enter a valid expiry date (MM/YY).";
  }
  const cvcValidation = cardValidator.cvv(cvc);
  if (!cvcValidation.isValid) {
    return "Please enter a valid CVC.";
  }
  if (!address.trim()) {
    return "Please enter your billing address.";
  }
  return null;
} 