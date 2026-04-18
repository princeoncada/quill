import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth(
  async function proxy() { },
  {
    publicPaths: [
      "/",
      "/pricing",
      "/api/auth/(.*)",
      "/api/webhooks/stripe",
      "/api/uploadthing",
      "/api/uploadthing/(.*)",
      "/api/trpc/(.*)",
    ]
  }
);

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};