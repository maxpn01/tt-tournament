import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="text-5xl">🏓</div>
          <h1 className="mt-4 text-2xl font-bold">Tournament not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Check the shared link or start a new local tournament.
          </p>
          <Link href="/" className={cn(buttonVariants(), "mt-6")}>Open tournament control</Link>
        </CardContent>
      </Card>
    </main>
  );
}
