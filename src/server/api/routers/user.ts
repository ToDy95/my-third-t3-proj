import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { registerSchema } from "@/app/schemas/user-schemas";
import { hashPassword, sanitizeEmail } from "@/lib/utils";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          name: input.email.split("@")[0] ?? "",
          address: input.address,
          phoneNumber: input.phoneNumber,
          image: input.image ?? null,
          role: input.role,
          email: sanitizeEmail(input.email),
          password: await hashPassword(input.password),
        },
      });
    }),
  getInactiveUsers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany({
      where: {
        isActive: false,
      },
    });
  }),
  activateUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          isActive: true,
        },
      });
    }),
});
