import { Expand, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";

interface PdfFullscreenProps {
  fileUrl: String;
}

const PdfFullscreen = ({ fileUrl }: PdfFullscreenProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>();
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null);

  const { width, ref } = useResizeDetector();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v)
          setIsOpen(v);
      }}>
      <DialogTrigger asChild>
        <Button variant='ghost' className="gap-1.5" size="icon" aria-label="fullscreen" onClick={() => setIsOpen(true)}>
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="hidden">
          <DialogTitle>
            Fullscreen PDF
          </DialogTitle>
          <DialogDescription>
            PDF Fullview
          </DialogDescription>
        </div>
        <div ref={ref}>
          <div className="max-h-[calc(100vh-10rem)] mt-6 -mx-4 no-scrollbar  overflow-y-auto px-4">
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast.error("Error loading PDF", {
                  description: "Please try again."
                });
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={`${fileUrl}`}
              className='max-h-full'>
              {new Array(numPages).fill(0).map((_, i) =>
                <Page
                  key={i}
                  pageNumber={i + 1}
                  width={width}
                />)}
            </Document>
          </div>
        </div>
      </DialogContent>


    </Dialog>

  );
};

export default PdfFullscreen;