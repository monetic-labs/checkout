"use client";

import React, { useState } from "react";
import { validateIframeCheckout } from "@/components/form/iframe-checkout-validation";

function formatCardNumber(value: string) {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");
  // Insert a space after every 4 digits
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + "/" + digits.slice(2, 4);
}

export default function IframeCheckout() {
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiry(formatExpiry(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const validationError = validateIframeCheckout({
      email,
      cardNumber,
      expiry,
      cvc,
      address,
    });
    if (validationError) {
      setError(validationError);
      return;
    }
    // Placeholder for success
    setSuccess(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        className="w-full max-w-sm p-6 rounded-lg shadow-md border bg-white"
        onSubmit={handleSubmit}
        style={{ minWidth: 320 }}
      >
        <h2 className="text-xl font-bold mb-3 text-center">Checkout</h2>
        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-2 py-1.5 border rounded bg-white placeholder-gray-400 text-sm text-black caret-black"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
          />
        </div>
        <div className="mb-4 p-3 border rounded bg-gray-50">
          <h3 className="text-base font-semibold mb-2 text-gray-700">Card Information</h3>
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              className="w-full px-2 py-1.5 border rounded bg-white text-sm text-black caret-black"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>
          <div className="flex gap-2 mb-1.5">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">Expiry</label>
              <input
                type="text"
                className="w-full px-2 py-1.5 border rounded bg-white text-sm text-black caret-black"
                value={expiry}
                onChange={handleExpiryChange}
                maxLength={5}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">CVC</label>
              <input
                type="text"
                className="w-full px-2 py-1.5 border rounded bg-white text-sm text-black caret-black"
                value={cvc}
                onChange={e => setCvc(e.target.value.replace(/\D/g, ""))}
                maxLength={4}
                placeholder="123"
                required
              />
            </div>
          </div>
        </div>
        <div className="mb-4 p-3 border rounded bg-gray-50">
          <h3 className="text-base font-semibold mb-2 text-gray-700">Billing Information</h3>
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Country</label>
            <input
              type="text"
              className="w-full px-2 py-1.5 border rounded bg-gray-100 text-gray-500 cursor-not-allowed text-sm text-black caret-black"
              value="United States"
              disabled
              readOnly
            />
          </div>
          <div className="mb-1.5">
            <label className="block text-gray-700 mb-1">Address</label>
            <input
              type="text"
              className="w-full px-2 py-1.5 border rounded bg-white text-sm text-black caret-black"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="123 Main St, City, State, ZIP"
              required
            />
          </div>
        </div>
        {error && <div className="text-red-500 mb-2 text-center text-sm">{error}</div>}
        {success && <div className="text-green-600 mb-2 text-center text-sm">Payment successful! (placeholder)</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition text-base"
        >
          Pay
        </button>
      </form>
    </div>
  );
} 