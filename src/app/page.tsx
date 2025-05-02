import { OrderInput } from "@/components/home/order-input";
import { Card } from "@heroui/card";

export default function OrderPage() {
  return (
    <div className="flex items-center justify-center">
      <Card className="p-8 md:p-12 text-center">
        <h1 className="text-3xl font-bold mb-2">Monetic Checkout</h1>
        <p className="text-gray-400 mb-6">
          Enter the Order ID provided to complete your purchase.
        </p>
        <OrderInput />
      </Card>
    </div>
  );
}
