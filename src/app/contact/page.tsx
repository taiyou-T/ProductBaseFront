"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { INQUIRY_CATEGORIES } from "@/lib/inquiry";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const guestSchema = z.object({
  category: z.enum(["account", "listing", "feedback", "other"], {
    message: "お問い合わせ種別を選択してください",
  }),
  body: z
    .string()
    .min(10, "お問い合わせ内容は10文字以上で入力してください")
    .max(500, "お問い合わせ内容は500文字以内で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
});

const memberSchema = guestSchema.omit({ email: true });

type GuestForm = z.infer<typeof guestSchema>;
type MemberForm = z.infer<typeof memberSchema>;

function ContactForm({
  isLoggedIn,
  token,
  userEmail,
}: {
  isLoggedIn: boolean;
  token: string | null;
  userEmail?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GuestForm | MemberForm>({
    resolver: zodResolver(isLoggedIn ? memberSchema : guestSchema),
    defaultValues: {
      category: "other",
      body: "",
      email: userEmail ?? "",
    },
  });

  const bodyValue = watch("body") ?? "";

  const onSubmit = async (data: GuestForm | MemberForm) => {
    setError(null);
    setSuccess(false);

    try {
      await api(
        "/public/inquiries",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token,
      );
      setSuccess(true);
      reset({
        category: "other",
        body: "",
        email: userEmail ?? "",
      });
    } catch (e) {
      setError(getApiErrorMessage(e, "送信に失敗しました"));
    }
  };

  return (
    <>
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
          お問い合わせを受け付けました。内容を確認のうえ、ご連絡いたします。
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            お問い合わせ種別
          </label>
          <select
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            {...register("category")}
          >
            {INQUIRY_CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
        </div>

        {!isLoggedIn && (
          <Input
            label="メールアドレス"
            type="email"
            error={(errors as { email?: { message?: string } }).email?.message}
            {...register("email")}
          />
        )}

        {isLoggedIn && userEmail && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            返信先メールアドレス: <span className="font-medium text-zinc-900 dark:text-zinc-100">{userEmail}</span>
          </p>
        )}

        <div className="space-y-1">
          <Textarea
            label="お問い合わせ内容"
            rows={8}
            maxLength={500}
            error={errors.body?.message}
            placeholder="お問い合わせ内容を10文字以上で入力してください"
            {...register("body")}
          />
          <p className="text-xs text-zinc-500">{bodyValue.length} / 500文字</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "送信中..." : "送信する"}
        </Button>
      </form>
    </>
  );
}

export default function ContactPage() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const isLoggedIn = Boolean(token && user);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-zinc-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">お問い合わせ</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          ご質問・ご要望・不具合報告などはこちらからお送りください。通常2〜3営業日以内にご返信いたします。
        </p>
      </div>

      <ContactForm
        key={isLoggedIn ? `member-${user?.id}` : "guest"}
        isLoggedIn={isLoggedIn}
        token={token}
        userEmail={user?.email}
      />
    </div>
  );
}
