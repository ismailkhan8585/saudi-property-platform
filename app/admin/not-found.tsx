import Link from 'next/link';

export default function AdminNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-surface-secondary px-4" dir="ltr">
      <section className="w-full max-w-md rounded-3xl border bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold text-gold-700">Not found</p>
        <h1 className="mt-2 text-2xl font-extrabold text-navy-800">This admin record does not exist</h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">It may have been removed or the link may be outdated.</p>
        <Link href="/admin/properties" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-navy-700 px-5 font-bold text-white">Back to properties</Link>
      </section>
    </main>
  );
}
