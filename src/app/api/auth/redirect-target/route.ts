import { getCurrentViewer } from "@/lib/current-viewer";

export const dynamic = "force-dynamic";

export async function GET() {
  const viewer = await getCurrentViewer();

  if (!viewer.isSignedIn) {
    return Response.json({ target: "/sign-in" });
  }

  if (viewer.isAdmin) {
    return Response.json({ target: "/" });
  }

  if (viewer.isDriver || viewer.hasDriverApplication) {
    return Response.json({ target: "/driver/dashboard" });
  }

  return Response.json({ target: "/" });
}
