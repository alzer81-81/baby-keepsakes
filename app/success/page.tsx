export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <div className="max-w-lg rounded-2xl border border-stone-300 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-stone-900">Payment Received</h1>
        <p className="mt-3 text-sm text-stone-700">
          Thanks for your order. We are preparing your print-ready poster and notifying the admin team.
        </p>
        <a className="mt-6 inline-block rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white" href="/builder">
          Build another poster
        </a>
      </div>
    </main>
  );
}
