import Link from "next/link";

import { auth } from "@/server/auth";
import { serverApi, HydrateClient } from "@/trpc/server";

import { signOut } from "@/server/auth";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/providers/theme-toggle";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }
  if (session.user?.isActive === false) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Account Deactivated</h1>
          <p className="text-lg">
            Your account has been deactivated. Please contact support for more
            information.
          </p>
          <Link href="/" className="text-blue-500 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello</h1>
      </div>
    </div>
  );
}
