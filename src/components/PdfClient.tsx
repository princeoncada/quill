"use client"

import dynamic from "next/dynamic"

const PdfRenderer = dynamic(() => import("@/components/PdfRenderer"), {
  ssr: false,
})

interface PdfClientProps {
  url: string
}

export default function PdfClient({ url }: PdfClientProps) {
  return <PdfRenderer url={url} />
}