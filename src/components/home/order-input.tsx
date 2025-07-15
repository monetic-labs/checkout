"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

export function OrderInput() {
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId) {
      router.push(`/${orderId}`);
    }
  };

  return (
    <form className="flex items-center gap-4" onSubmit={handleSubmit}>
      <Input
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />
      <Button color="primary" type="submit">
        Go to Order
      </Button>
    </form>
  );
}
