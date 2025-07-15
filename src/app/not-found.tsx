import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="p-4 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-xl mb-8">
          The order you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button as={Link} color="primary" href="/">
          Go Home
        </Button>
      </Card>
    </div>
  );
}
