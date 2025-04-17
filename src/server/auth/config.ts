import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { encode as defaultEncode } from "next-auth/jwt";
import { db } from "@/server/db";
import { sanitizeEmail, verifyPassword } from "@/lib/utils";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      phoneNumber: string;
      address: string;
      name: string;
      email: string;
      password: string;
      image: string | null;
      role: "BUYER" | "SELLER" | "ADMIN" | "MANAGER";
      isActive: boolean;
    } & DefaultSession["user"];
  }
}
type Role = "BUYER" | "SELLER" | "ADMIN" | "MANAGER";

const adapter = PrismaAdapter(db);
// const useSecureCookies =
//   process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;
interface SessionWithRole {
  sessionToken: string;
  userId: string;
  expires: Date;
  role?: Role;
}

adapter.createSession = async function (session: SessionWithRole) {
  return db.session.create({
    data: {
      sessionToken: session.sessionToken,
      userId: session.userId,
      expires: session.expires,
    },
  });
};
export const authConfig = {
  providers: [
    DiscordProvider,
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials");
        }
        const { email, password } = credentials;
        if (!email || !password) {
          throw new Error("Missing credentials");
        }
        const user = await db.user.findFirst({
          where: {
            email: sanitizeEmail(email as string),
          },
        });
        if (!user) {
          throw new Error("Invalid User");
        }
        if (!user.password) {
          throw new Error("Invalid User");
        }
        const isAnValidPassword: boolean = await verifyPassword(
          user?.password,
          password as string,
        );

        if (!isAnValidPassword) {
          throw new Error("Invalid Password");
        }

        return user;
      },
    }),
  ],
  adapter,
  secret: process.env.NEXTAUTH_SECRET ?? crypto.randomUUID(),
  // cookies: {
  //   sessionToken: {
  //     name: `${useSecureCookies ? "__Secure-" : ""}authjs.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: true,
  //     },
  //   },
  // },
  callbacks: {
    session: ({ session, user }) => {
      const sessionUser = {
        ...session,

        user: {
          ...session.user,
          id: user.id,
        },
      };
      console.log("🚀 ~ session ~ sessionUser:", sessionUser);

      return sessionUser;
    },
    async jwt({ token, account }) {
      // console.log("---------------------", account);
      if (account?.provider === "credentials") {
        // console.log("intra ???? ");
        token.accessToken = account.access_token;
        // token.credentials = account.provider;
      }

      console.log("🚀 ~ jwt ~ token:", token);

      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      console.log("🚀 ~ jwt ~ params:", params);
      if (params?.token?.sub) {
        const sessionToken = crypto.randomUUID();
        // console.log("dsadsadasdasdsa");
        if (!params.token.sub) {
          throw new Error("No user sub");
        }

        if (!adapter.createSession) {
          throw new Error("No createSession found");
        }
        const user = await db.user.findUnique({
          where: { id: params.token.sub },
        });
        if (!user) {
          throw new Error("User not found");
        }

        const createdSession = await adapter.createSession({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          role: user.role as Role,
        } as SessionWithRole);

        if (!createdSession) {
          throw new Error("No created session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
} satisfies NextAuthConfig;
