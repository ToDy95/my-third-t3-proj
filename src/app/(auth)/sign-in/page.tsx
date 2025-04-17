import React from "react";
import { SignInView } from "./sign-in-view";
import { redirect } from "next/navigation";

import { auth } from "@/server/auth";

const SignIn = async () => {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return <SignInView />;
};

export default SignIn;
