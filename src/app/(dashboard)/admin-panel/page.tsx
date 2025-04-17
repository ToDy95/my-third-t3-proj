import React from "react";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { serverApi } from "@/trpc/server";
import { DashboardView } from "./dashboard-view";
const page = async () => {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }

  if (session.user?.role !== "ADMIN" && session.user?.role !== "MANAGER") {
    return redirect("/");
  }

  const initialData = await serverApi.user.getInactiveUsers();
  console.log(initialData);
  return <DashboardView initialData={initialData} />;
};

export default page;
