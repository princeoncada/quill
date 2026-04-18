"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { trpc } from "@/app/_trpc/client";

const UpgradeButton = ({ isSubscribed }: { isSubscribed: boolean; }) => {

  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url ?? "/dashboard/billing";
    }
  });

  const dashboardRedirect = () => {
    window.location.href = "/dashboard"
  }

  return (
    <Button onClick={isSubscribed ? () => dashboardRedirect() : () => createStripeSession()} className="w-full py-6 bg-blue-600 hover:bg-blue-700 hover:cursor-pointer">
      {
        isSubscribed ? (
          <>
            Current Plan
          </>
        ) : (
          <>
            Upgrade<ArrowRight className="h-5 w-5" />
          </>
        )
      }
    </Button>
  );
};

export default UpgradeButton;