import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const layoutRouter = createTRPCRouter({
  /**
   * @desc: get layouts by user id,
   * @param: user_id
   * @returns: Array<layout_id>
   */
  getLayoutByUserId: publicProcedure
    .input(z.object({ user_id: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user_id = input.user_id;

      return await ctx.db.layout.findMany({
        where: { user_id },
        select: { layout_name: true, layout_id: true },
      });
    }),
  /**
   * @desc: get layouts by user id,
   * @param: user_id
   * @returns: Array<layout_id>
   */
  getLayoutsByIds: publicProcedure
    .input(z.array(z.number()))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.layout.findMany({
        where: {
          layout_id: {
            in: input,
          },
        },
        select: { layout_name: true, layout_id: true },
      });
    }),

  /**
   * @desc: get all layouts,
   * @param:
   * @returns: Array<layout_id>
   */
  getAllLayouts: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.layout.findMany({ select: { layout_id: true } });
  }),

  /**
   * @desc: create new layout,
   * @param: layout_name, user_id
   * @returns: New Layout
   */
  createLayout: publicProcedure
    .input(
      z.object({
        layout_name: z.string().min(1),
        user_id: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const layout_name = input.layout_name;
      const user_id = input.user_id;
      return await ctx.db.layout.create({
        data: { user_id, layout_name },
      });
    }),

  /**
   * @desc: update Layout by layout_id
   * @param: layout_id, layout_name
   * @returns: updated Layout
   */
  updateLayout: publicProcedure
    .input(
      z.object({
        layout_name: z.string().min(1),
        layout_id: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const layout_name = input.layout_name;
      const layout_id = input.layout_id;
      return await ctx.db.layout.update({
        where: { layout_id },
        data: { layout_name },
      });
    }),

  /**
   * @desc: delete Layout by layout id
   * @param: layout_id
   * @returns: true
   */
  deleteLayout: publicProcedure
    .input(
      z.object({
        layout_id: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const layout_id = input.layout_id;
      return await ctx.db.layout.deleteMany({ where: { layout_id } });
    }),
});
