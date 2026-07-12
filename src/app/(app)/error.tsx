"use client";

import { useEffect } from "react";

// Error boundary de las páginas del panel.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-center">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">No se pudo cargar esta sección</h2>
      <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">Probá de nuevo.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-1 rounded-lg bg-main-600 px-4 py-2 text-sm font-semibold text-white hover:bg-main-700"
      >
        Reintentar
      </button>
    </div>
  );
}
