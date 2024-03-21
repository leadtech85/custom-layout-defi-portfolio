import { ILayoutContext } from "@/config/type";
import { createContext } from "react";

export const LayoutContext = createContext<ILayoutContext>({
  user: 0,
  layouts: [],
  setLayouts: () => {},
  current: 0,
  setCurrentLayout: () => {},
  widgets: [],
  setWidgets: () => {},
});
