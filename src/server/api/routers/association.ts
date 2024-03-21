import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const associationRouter = createTRPCRouter({
  /**
   * @desc: get widgets_id by layout_id,
   * @param: user_id
   * @returns: Array<layout_id>
   */
  getWidgetIdByLayoutId: publicProcedure
    .input(z.object({ layout_id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const layout_id = input.layout_id;

      const widgets = await ctx.db.layout_Widget.findMany({
        where: { layout_id },
        include: {
          widget: true,
        },
        orderBy: {
          widget: {
            i: "asc",
          },
        },
      });
      return widgets;
    }),

  /**
   * @desc: create new association,
   * @param: layout_id, widget_id
   * @returns: New Layout
   */
  createAssociation: publicProcedure
    .input(
      z.object({
        layout_id: z.number(),
        widget_id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const layout_id = input.layout_id;
      const widget_id = input.widget_id;
      return await ctx.db.layout_Widget.create({
        data: { widget_id, layout_id },
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
