'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-surface-secondary px-4" dir="ltr">
      <section className="w-full max-w-md rounded-3xl border border-surface-border bg-white p-6 text-center shadow-lg sm:p-8">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600"><AlertTriangle className="h-6 w-6" /></span>
        <h1 className="mt-5 text-xl font-extrabold text-navy-800">Admin page could not load</h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">Check the database connection and try again. Your data has not been changed.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={reset} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-navy-700 px-4 font-bold text-white hover:bg-navy-800"><RefreshCw className="h-4 w-4" />Try again</button>
          <Link href="/admin/login" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-surface-border px-4 font-bold text-navy-700 hover:bg-gray-50">Return to sign in</Link>
        </div>
      </section>
    </main>
  );
}
