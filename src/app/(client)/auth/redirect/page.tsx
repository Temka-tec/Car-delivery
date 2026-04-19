import { redirect } from "next/navigation";
import { getCurrentViewer } from "@/lib/current-viewer";

export const dynamic = "force-dynamic";

export default async function AuthRedirectPage() {
  const viewer = await getCurrentViewer();

  if (!viewer.isSignedIn) {
    redirect("/sign-in");
  }

  if (viewer.isAdmin) {
    redirect("/");
  }

  if (viewer.isDriver || viewer.hasDriverApplication) {
    redirect("/driver/dashboard");
  }

  redirect("/");
}
