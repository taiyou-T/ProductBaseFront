"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/Button";
import type { AuthResponse } from "@/types";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

function GoogleRedirectLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithRedirect = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api<{ url: string }>("/auth/google/redirect");
      window.location.href = res.url;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Google ログインに失敗しました");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        disabled={loading}
        onClick={loginWithRedirect}
      >
        {loading ? "接続中..." : "Google でログイン"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

function GoogleSdkLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithSdk = useGoogleLogin({
    onSuccess: async (response) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api<AuthResponse>("/auth/google/token", {
          method: "POST",
          body: JSON.stringify({ access_token: response.access_token }),
        });
        setAuth(res.token, res.user);
        router.push("/dashboard");
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Google ログインに失敗しました");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google ログインがキャンセルされました"),
  });

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        disabled={loading}
        onClick={() => loginWithSdk()}
      >
        {loading ? "接続中..." : "Google でログイン"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function GoogleLoginButton() {
  if (!clientId) {
    return <GoogleRedirectLogin />;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleSdkLogin />
    </GoogleOAuthProvider>
  );
}
