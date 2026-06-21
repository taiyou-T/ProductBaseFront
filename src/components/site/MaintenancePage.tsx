export function MaintenancePage({ message }: { message: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 max-w-lg">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">メンテナンス中</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
}
