import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const widgetRouter = createTRPCRouter({
  /**
   * @desc: get all widgets,
   * @param:
   * @returns: Array<widget_id>
   */
  getAllWidgets: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.widget.count({});
  }),
  /**
   * @desc: get widgets by id,
   * @param: widget_id
   * @returns: Widget
   */
  getWidgetById: publicProcedure
    .input(z.object({ widget_id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const widget_id = Number(input.widget_id);
      return await ctx.db.widget.findFirst({
        where: { widget_id },
      });
    }),
  /**
   * @desc: create widget,
   * @param: widget_name, widget_description, x, y, w, h, i, visible
   * @returns: Widget
   */
  createWidget: publicProcedure
    .input(
      z.object({
        widget_name: z.string().min(1),
        widget_description: z.string().min(1),
        x: z.number(),
        y: z.number(),
        w: z.number(),
        h: z.number(),
        i: z.string().min(1),
        visible: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const x = Number(input.x);
      const y = Number(input.y);
      const w = Number(input.w);
      const h = Number(input.h);
      const i = input.i;
      const visible = input.visible;
      const widget_name = input.widget_name;
      const widget_description = input.widget_description;
      return await ctx.db.widget.create({
        data: { x, y, w, h, i, widget_name, widget_description, visible },
      });
    }),
  /**
   * @desc: update widget by id,
   * @param: widget_id, widget_name, widget_description, x, y, w, h, i, visible
   * @returns: Widget
   */
  updateWidgetById: publicProcedure
    .input(
      z.object({
        widget_id: z.number(),
        widget_name: z.string().min(1),
        widget_description: z.string().min(1),
        x: z.number(),
        y: z.number(),
        w: z.number(),
        h: z.number(),
        i: z.string().min(1),
        visible: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const x = Number(input.x);
      const y = Number(input.y);
      const w = Number(input.w);
      const h = Number(input.h);
      const i = input.i;
      const widget_name = input.widget_name;
      const widget_id = Number(input.widget_id);
      const widget_description = input.widget_description;
      const visible = input.visible ?? true;
      return await ctx.db.widget.update({
        where: { widget_id },
        data: { x, y, w, h, i, widget_name, widget_description, visible },
      });
    }),
  /**
   * @desc: delete widget by widget id
   * @param: widget_id
   * @returns: true
   */
  deleteLayout: publicProcedure
    .input(
      z.object({
        widget_id: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const widget_id = input.widget_id;
      return await ctx.db.widget.deleteMany({ where: { widget_id } });
    }),
});
