import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }

  if (session.user?.role !== "BUYER" && session.user?.role !== "ADMIN") {
    return redirect("/");
  }
  return <div>page</div>;
};

export default page;
