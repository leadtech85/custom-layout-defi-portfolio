import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { layoutRouter } from "./routers/layout";
import { widgetRouter } from "./routers/widget";
import { associationRouter } from "./routers/association";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  layout: layoutRouter,
  widget: widgetRouter,
  association: associationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
