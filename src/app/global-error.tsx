"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="grid min-h-screen place-items-center bg-[#fbfaf6] px-6 py-16 text-[#172821]">
          <section className="w-full max-w-2xl border border-[#d7ded8] bg-white p-8 shadow-[0_24px_70px_rgba(25,54,43,.1)] sm:p-12" aria-labelledby="error-heading">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#225748]">Something went wrong</p>
            <h1 id="error-heading" className="mt-3 text-4xl leading-tight sm:text-5xl">We could not load this page.</h1>
            <p className="mt-5 max-w-xl leading-7 text-[#40534a]">Please try again. If the problem continues, return to the home page or contact the Church Govern team.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={reset} className="min-h-12 bg-[#153f35] px-5 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#bd8b43]">Try again</button>
              <Link href="/" className="inline-flex min-h-12 items-center border border-[#153f35] px-5 py-3 font-semibold text-[#153f35] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#bd8b43]">Return home</Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
