export default function AdminLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-surface-secondary px-4" role="status" aria-live="polite">
      <div className="text-center">
        <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-navy-600 motion-reduce:animate-none" />
        <p className="mt-4 text-sm font-semibold text-navy-700">Loading admin panel…</p>
      </div>
    </div>
  );
}
