"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        category: "client",
        action: "uncaught_render_error",
        errorId: error.digest ?? "unavailable",
      }),
    );
  }, [error.digest]);

  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-[#10110f] px-5 text-[#f0eee5]">
        <main className="max-w-xl border border-[#3b3d37] bg-[#171915] p-8">
          <p className="font-mono text-xs uppercase tracking-[.12em] text-[#d5a94e]">
            System error
          </p>
          <h1 className="mt-5 font-serif text-5xl">The page could not be rendered.</h1>
          <p className="mt-4 text-sm leading-7 text-[#c9c6bb]">
            No information was submitted. Try the request again, or return later if the problem continues.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-7 border border-[#d5a94e] px-4 py-3 text-sm font-semibold"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
