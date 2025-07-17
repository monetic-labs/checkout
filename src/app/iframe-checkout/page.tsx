"use client";

import React, { useState } from "react";
import { validateIframeCheckout } from "@/app/iframe-checkout/validators";
import { formatCardNumber, formatExpiry } from "@/app/iframe-checkout/formatters";
import { CreditCardIcon } from "@/components/icons";
import { createAndStoreWallet, getExistingWallet } from "./handlers";

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export default function IframeCheckout() {
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  // Address fields
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [checkoutMethod, setCheckoutMethod] = useState("card");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiry(formatExpiry(e.target.value));
  };

  const showExpandedAddress = address1.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setWalletAddress(null);

    // Restore input validation
    const address = [address1, address2, city, state, zip].filter(Boolean).join(", ");
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

    // Check if wallet already exists for this email
    const existingWallet = getExistingWallet(email);
    if (existingWallet) {
      setWalletAddress(existingWallet);
      setSuccess(true);
      return;
    }

    // Create wallet linked to user's email and show address
    try {
      const address = await createAndStoreWallet(email);
      setWalletAddress(address);
      setSuccess(true);
    } catch (err) {
      setError("Failed to create wallet");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        className="w-full max-w-sm p-6 rounded-lg shadow-md border bg-white"
        onSubmit={handleSubmit}
        style={{ minWidth: 320 }}
      >
        {/* Top radio option for Card */}
        <div className="flex items-center mb-4">
          <input
            type="radio"
            id="card-option"
            name="checkout-method"
            checked={checkoutMethod === "card"}
            onChange={() => setCheckoutMethod("card")}
            className="form-radio h-4 w-4 text-blue-600"
          />
          <label htmlFor="card-option" className="ml-2 text-base font-semibold text-gray-800 cursor-pointer">
            <CreditCardIcon className="inline-block mr-1" /> Card
          </label>
        </div>
        {/* Card form section */}
        {checkoutMethod === "card" && (
          <>
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
                <label className="block text-gray-700 mb-1">Address Line 1</label>
                <input
                  type="text"
                  className="w-full px-2 py-1.5 border rounded bg-white text-sm text-black caret-black"
                  value={address1}
                  onChange={e => setAddress1(e.target.value)}
                  placeholder="123 Main St"
                  required
                />
              </div>
              {showExpandedAddress && (
                <>
                  <div className="mb-1.5">
                    <label className="block text-gray-700 mb-1">Address Line 2 (optional)</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 border rounded bg-white text-sm text-black caret-black"
                      value={address2}
                      onChange={e => setAddress2(e.target.value)}
                      placeholder="Apt, suite, etc."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-1.5">
                    <div>
                      <label className="block text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        className="w-full px-2 py-1.5 border rounded bg-white text-sm text-black caret-black"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">State</label>
                      <select
                        className="w-full px-2 py-1.5 border rounded bg-white text-sm text-black caret-black"
                        value={state}
                        onChange={e => setState(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        {US_STATES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        className="w-full px-2 py-1.5 border rounded bg-white text-sm text-black caret-black"
                        value={zip}
                        onChange={e => setZip(e.target.value.replace(/\D/g, ""))}
                        placeholder="ZIP"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            {error && <div className="text-red-500 mb-2 text-center text-sm">{error}</div>}
            {success && <div className="text-green-600 mb-2 text-center text-sm">Payment successful! (placeholder)</div>}
            {walletAddress && (
              <div className="text-blue-600 mb-2 text-center text-sm">
                Wallet Address: {walletAddress}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition text-base"
            >
              Pay
            </button>
          </>
        )}
        {/* Bottom radio option for Monetic Pay */}
        <div className="flex items-center my-4">
          <input
            type="radio"
            id="monetic-option"
            name="checkout-method"
            checked={checkoutMethod === "monetic"}
            onChange={() => setCheckoutMethod("monetic")}
            className="form-radio h-4 w-4 text-green-700"
          />
          <label htmlFor="monetic-option" className="ml-2 text-base font-semibold cursor-pointer" style={{ color: '#228B22' }}>
            Monetic Pay
          </label>
        </div>
        {/* Monetic Pay section */}
        {checkoutMethod === "monetic" && (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="mb-4 text-lg font-semibold text-center">Scan to pay with Monetic Pay</p>
            <div className="mb-6 bg-white p-4 rounded shadow text-center text-gray-500">
              QR code will appear here.
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 