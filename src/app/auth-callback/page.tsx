import AuthCallbackClient from "@/components/auth-callback/AuthCallbackClient";
import AuthCallbackStatus from "@/components/auth-callback/AuthCallbackStatus";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense
      fallback={<AuthCallbackStatus />}
    >
      <AuthCallbackClient />
    </Suspense>
  );
};

export default Page;