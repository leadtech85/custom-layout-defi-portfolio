import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  /**
   * @desc: get user by address
   * @param: address
   * @returns: user_id
   */
  getUser: publicProcedure
    .input(z.object({ address: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const address = input.address;
      return await ctx.db.user.findFirst({
        where: { address },
        select: { user_id: true },
      });
    }),
  /**
   * @desc: create new user,
   * @param: address, email, password
   * @returns: New user
   */
  createUser: publicProcedure
    .input(
      z.object({
        address: z.string().min(1),

      }),
    )
    .mutation(async ({ ctx, input }) => {
      const address = input.address;
      return await ctx.db.user.create({
        data: { address },
      });
    }),
});
