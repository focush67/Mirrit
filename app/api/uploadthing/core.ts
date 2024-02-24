import { getSelf } from "@/services/auth-service";
import { createUploadthing, type FileRouter } from "uploadthing/next";

// Requires modification

const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const self = await getSelf();
      // Need post here
      return { user: self };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete :", { metadata, file });
      return {
        fileUrl: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
