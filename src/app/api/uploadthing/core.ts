import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { OpenAIEmbeddings } from "@langchain/openai";
import { pinecone } from "@/lib/pinecone";

const f = createUploadthing();

async function indexPdfDocuments(args: {
  docs: Array<{
    pageContent: string,
    metadata?: Record<string, unknown>
  }>
  namespace: string
}) {
  const { docs, namespace } = args

  const pineconeIndex = pinecone.Index({ name: "quill" })

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: "text-embedding-3-small"
  })

  const texts = docs.map((doc) => {
    const text = doc.pageContent?.trim() || ""
    return text
  })

  if (!texts.length || texts.every((text) => !text.length)) {
    throw new Error("No usable text extracted from PDF.")
  }

  const vectors = await embeddings.embedDocuments(texts)

  const records = vectors.map((values, i) => ({
    id: `${namespace}-${i}`,
    values,
    metadata: {
      text: docs[i]?.pageContent || "",
      pageNumber:
        (docs[i]?.metadata as { loc?: { pageNumber?: number } } | undefined)?.loc?.pageNumber ?? i + 1
    }
  }))

  await pineconeIndex.namespace(namespace).upsert({ records })
}

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const { getUser } = getKindeServerSession();
      const user = await getUser()
      if (!user || !user.id) throw new TRPCError({ code: "UNAUTHORIZED" })

      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file.ufsUrl,
          uploadStatus: "PROCESSING"
        }
      })

      try {
        const response = await fetch(file.ufsUrl)

        console.log("2. Response status:", response.status, response.statusText)
        if (!response.ok) {
          throw new Error(`Failed to fetch uploaded file: ${response.status} ${response.statusText}`)
        }

        const blob = await response.blob()

        const loader = new PDFLoader(blob)

        const pageLevelDocs = await loader.load()

        await indexPdfDocuments({
          docs: pageLevelDocs,
          namespace: createdFile.id
        })

        await db.file.update({
          data: {
            uploadStatus: "SUCCESS",
          },
          where: {
            id: createdFile.id,
          },
        })

      } catch (err) {
        await db.file.update({
          data: {
            uploadStatus: "FAILED",
          },
          where: {
            id: createdFile.id,
          },
        })
        console.error(err)
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
