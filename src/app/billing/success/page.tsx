import Link from "next/link";

export default function BillingSuccessPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <h1 className="text-2xl font-bold">お支払いが完了しました</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        プランの反映には数秒かかる場合があります。
      </p>
      <Link href="/settings/billing" className="inline-block text-indigo-600 hover:underline">
        プラン設定に戻る
      </Link>
    </div>
  );
}
