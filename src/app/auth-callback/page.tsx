"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "../_trpc/client"
import { Loader2 } from "lucide-react"

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const origin = searchParams.get("origin")

  const authCallback = trpc.authCallback.useQuery(undefined, { retry: true, retryDelay: 500 })
  
  useEffect(() => {
    if (authCallback.isSuccess) {
      router.push(origin ? `/${origin}` : "/dashboard")
    } else if (authCallback.isError) {
      router.push("/sign-in")
    }
  }, [authCallback.isSuccess, authCallback.isError, router, origin])

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800"></Loader2>
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  )
}

export default Page