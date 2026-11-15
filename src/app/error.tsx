"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="font-display mt-3 text-4xl text-forest">We hit a snag loading this page.</h1>
      <p className="mt-4 text-stone">Please try again. If it keeps happening, write to us and mention the code below.</p>
      {error.digest ? <p className="mt-2 font-mono text-xs text-stone">{error.digest}</p> : null}
      <div className="mt-8 flex justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">Try again</button>
        <Link href="/" className="btn btn-ghost">Go home</Link>
      </div>
    </div>
  );
}
