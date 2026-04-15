"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { toast } from "sonner"

import DropZone from "react-dropzone"
import { Cloud, File, Loader2 } from "lucide-react"
import { useUploadThing } from "@/lib/uploadthing"
import { trpc } from "@/app/_trpc/client"
import { useRouter } from "next/navigation"

const UploadDropZone = () => {
  const router = useRouter()

  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const { startUpload } = useUploadThing("pdfUploader")

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`)
    },
    retry: true,
    retryDelay: 500
  })

  const startSimulatedProgress = () => {
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 500)

    return interval
  }

  return <DropZone multiple={false} onDrop={async (acceptedFiles) => {
    setIsUploading(true)

    const progressInterval = startSimulatedProgress()

    const res = await startUpload(acceptedFiles)

    if (!res || res.length === 0) {
      return toast.error("Something went wrong", {
        description: "Please try again later."
      })
    }

    const [fileResponse] = res

    const key = fileResponse.key

    if (!key) {
      return toast.error("Something went wrong", {
        description: "Please try again later."
      })
    }

    clearInterval(progressInterval)
    setUploadProgress(100)

    startPolling({ key })
  }}>
    {({ getRootProps, getInputProps, acceptedFiles }) => (
      <div {...getRootProps()} className="border h-64 m-4 border-dashed border-gray-300 rounded-lg">
        <div className="flex item-center justify-center h-full w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
              <p className="mb-2 text-sm text-zine-700">
                <span className="font-semibold">
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-zinc-500">PDF (up to 4 MB)</p>
            </div>

            {acceptedFiles && acceptedFiles[0] ? (
              <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                <div className="px-3 py-2 h-full grid place-items-center">
                  <File className="h-4 w-4 text-blue-500" />
                </div>
                <div className="px-3 py-2 h-full text-sm truncate">
                  {acceptedFiles[0].name}
                </div>
              </div>
            ) : null}

            {isUploading ? (
              <div className="w-full mt-4 max-w-xs mx-auto">
                <Progress 
                indicatorColor={
                  uploadProgress === 100 ? "!bg-green-500" : "!bg-blue-500"
                }
                value={uploadProgress} className="h-1 w-full bg-zinc-200" />
                { uploadProgress === 100 ? (
                  <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Redirecting...
                  </div>
                ) : null }
              </div>
            ) : null}

            <input {...getInputProps()} type="file" id="dropzone-file" className="hidden" />
          </label>
        </div>
      </div>
    )}
  </DropZone>
}

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v)
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button className="bg-blue-600 hover:bg-blue-700" size="lg">Upload PDF</Button>
      </DialogTrigger>

      <DialogContent aria-describedby="dialog-description" dialog-description="Upload a PDF to start chatting" className="sm:max-w-lg">
        <div className="hidden">
          <DialogTitle>
            Upload PDF
          </DialogTitle>
          <DialogDescription>
            Upload a PDF to start chatting.
          </DialogDescription>
        </div>
        <UploadDropZone />
      </DialogContent>
    </Dialog>
  )
}

export default UploadButton