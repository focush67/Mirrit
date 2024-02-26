import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhooks(.*)",
    "/api/uploadthing",
    "/api/user",
    "/api/save",
    "/api/posts",
  ],
});

export const config = {
  matcher: ["/:path*"],
};
