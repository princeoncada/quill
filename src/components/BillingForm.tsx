"use client";

import { trpc } from "@/app/_trpc/client";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { toast } from "sonner";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface BillingFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {

  const { mutate: createStripeSession, isPending } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
      if (!url) {
        toast.error("There was a problem...", {
          description: "Please try again in a moment."
        });
      }
    }
  });

  return (
    <MaxWidthWrapper>
      <form className="mt-12" onSubmit={(e) => {
        e.preventDefault();
        createStripeSession();
      }}>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>You are currently on the <strong>{subscriptionPlan.isSubscribed ? "Pro" : "Free"}</strong> plan {" | "}
              {subscriptionPlan.isSubscribed ? (
                <span className="font-medium">
                  {subscriptionPlan.isCanceled ? "To be canceled on " : "Renews on "}
                  {format(subscriptionPlan.stripeCurrentPeriodEnd!, 'MM/dd/yyyy')}
                </span>
              ) : null}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col items-start space-y-2">
            <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer">
              {
                isPending ? (
                  <Loader2 className="mr-4 h-4 w-4 animate-spin" />
                ) : null
              }
              {
                subscriptionPlan.isSubscribed ? "Manage Subscription" : "Upgrade to PRO"
              }
            </Button>

          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
};

export default BillingForm;