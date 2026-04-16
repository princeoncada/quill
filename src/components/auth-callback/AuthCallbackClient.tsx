"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import AuthCallbackStatus from "./AuthCallbackStatus";


const AuthCallbackClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const authCallback = trpc.authCallback.useQuery(undefined, {
    retry: true,
    retryDelay: 500
  });

  useEffect(() => {
    if (authCallback.isSuccess) {
      router.push(origin ? `/${origin}` : "/dashboard");
    } else if (authCallback.isError) {
      router.push("/sign-in");
    }
  }, [authCallback.isSuccess, authCallback.isError, router, origin]);

  return (
    <AuthCallbackStatus />
  );
};

export default AuthCallbackClient;