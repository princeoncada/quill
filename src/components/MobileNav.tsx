"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from "./ui/button";

const MobileNav = ({ isAuth }: { isAuth: boolean; }) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const closeNav = () => setIsOpen(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setIsOpen(false);
      }
    };

    handleChange(mediaQuery);

    const listener = (e: MediaQueryListEvent) => handleChange(e);
    mediaQuery.addEventListener("change", listener);

    return () => mediaQuery.removeEventListener("change", listener);
  });

  return (
    <div className="sm:hidden!">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="relative z-50"
            variant="ghost"
            size="icon-lg"
          >
            {
              isOpen ? (
                <X className="h-5 w-5 text-zinc-700" />
              ) : (
                <Menu className="h-5 w-5 text-zinc-700" />
              )
            }
          </Button>
        </SheetTrigger>
        <SheetContent
          side="top"
          className="top-13.75! h-auto border-b border-zinc-200 px-0 pt-0 pb-0 shadow-xl "
          showCloseButton={false}
        >
          <div className="hidden">
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
          </div>
          <ul className="grid w-full gap-3 bg-white px-10 pt-6 pb-8">
            {!isAuth ? (
              <>
                <li>
                  <Link
                    onClick={closeNav}
                    className="flex w-full items-center font-semibold text-green-600"
                    href="/sign-up"
                  >
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </li>

                <li className="my-3 h-px w-full bg-gray-300" />

                <li>
                  <Link
                    onClick={closeNav}
                    className="flex w-full items-center font-semibold"
                    href="/sign-in"
                  >
                    Sign in
                  </Link>
                </li>

                <li className="my-3 h-px w-full bg-gray-300" />

                <li>
                  <Link
                    onClick={closeNav}
                    className="flex w-full items-center font-semibold"
                    href="/pricing"
                  >
                    Pricing
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={closeNav}
                    className="flex w-full items-center font-semibold"
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="my-3 h-px w-full bg-gray-300" />

                <li>
                  <Link
                    onClick={closeNav}
                    className="flex w-full items-center font-semibold"
                    href="/dashboard/billing"
                  >
                    Billing
                  </Link>
                </li>

                <li className="my-3 h-px w-full bg-gray-300" />

                <li>
                  <Link
                    onClick={closeNav}
                    className="flex w-full items-center font-semibold"
                    href="/sign-out"
                  >
                    Sign out
                  </Link>
                </li>
              </>
            )}
          </ul>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;