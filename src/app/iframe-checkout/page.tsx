import React, { useState } from "react";

export default function IframeCheckout() {
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    // TODO: Add validation and payment logic
    if (!email || !cardNumber || !expiry || !cvc) {
      setError("Please fill in all fields.");
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
        <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Card Number</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            maxLength={19}
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>
        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <label className="block text-gray-700 mb-1">Expiry</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              maxLength={5}
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 mb-1">CVC</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={cvc}
              onChange={e => setCvc(e.target.value)}
              maxLength={4}
              placeholder="123"
              required
            />
          </div>
        </div>
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        {success && <div className="text-green-600 mb-2 text-center">Payment successful! (placeholder)</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Pay
        </button>
      </form>
    </div>
  );
} 