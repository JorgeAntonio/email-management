"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Algo salió mal</h2>
      </div>
      <p className="text-muted-foreground text-center max-w-md">
        {error.message || "Ha ocurrido un error inesperado. Por favor, intenta de nuevo."}
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground">ID: {error.digest}</p>
      )}
      <Button onClick={reset} variant="outline">
        <RefreshCw className="mr-2 h-4 w-4" />
        Intentar de nuevo
      </Button>
    </div>
  );
}
