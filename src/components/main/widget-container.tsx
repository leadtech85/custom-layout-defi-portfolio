import {
  type Layout,
  type Layouts,
  Responsive,
  WidthProvider,
} from "react-grid-layout";
import { type FC, useEffect, useState, useContext } from "react";
import { Widget } from "./widget";
import { api } from "@/trpc/react";
import { WidgetType } from "@/config/type";
import { LayoutContext } from "@/context/layout-context";
import { Widgets } from "@/config/widget";

interface WidgetContainerProps {
  className?: string;
  rowHeight?: number;
  cols?: { lg: number; md: number; sm: number; xs: number; xxs: number };
}

const ResponsiveGridLayout = WidthProvider(Responsive);

export const WidgetContainer: FC<WidgetContainerProps> = ({
  cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
}) => {
  const [_, setCurrentBreakpoint] = useState<string>("lg");
  const [compactType] = useState<"horizontal" | "vertical" | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const { user, widgets } = useContext(LayoutContext);
  const updateWidget = api.widget.updateWidgetById.useMutation();
  const [layouts, setLayouts] = useState<Layouts>({
    lg: widgets
      .filter((widget) => widget.widget.visible)
      .map((widget) => {
        const { x, y, w, h, i } = widget.widget;
        return { x, y, w, h, i };
      }) as Layout[],
  });
  const [draggable, setDraggable] = useState<boolean>(false);

  const handleBreakpointChange = (newBreakpoint: string) => {
    setCurrentBreakpoint(newBreakpoint);
  };

  const handleLayoutChange = (changedLayouts: Layout[]) => {
    changedLayouts.forEach((layout) => {
      const widget = widgets.find((item) => item.widget.i === layout.i);
      if (!widget) return null;
      const widget_id = widget.widget.widget_id;
      const widget_name = widget.widget.widget_name;
      const widget_description = widget.widget.widget_description;
      const visible = widget.widget.visible;
      const { x, y, w, h, i } = widget.widget;
      if (({ x, y, w, h, i } as Layout) !== layout) {
        if (user)
          void updateWidget.mutateAsync({
            widget_id,
            widget_name,
            widget_description,
            x: layout.x,
            y: layout.y,
            w: layout.w,
            h: layout.h,
            visible,
            i: layout.i,
          });
        else {
          const widgets = JSON.parse(
            localStorage.getItem("widgets") as string,
          ) as Array<WidgetType>;
          const newWidgets = widgets.map((widget) => {
            if (widget.widget_id === widget_id) {
              return {
                widget_id,
                widget_name,
                widget_description,
                x: layout.x,
                y: layout.y,
                w: layout.w,
                h: layout.h,
                visible,
                i: layout.i,
              };
            } else return widget;
          });
          localStorage.setItem("widgets", JSON.stringify(newWidgets));
        }
      }
    });
  };

  const handleDragStart = () => {
    setDraggable(true);
  };

  const handleDragStop = () => {
    setDraggable(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const newWidgets = {
      lg: widgets
        .filter((widget) => widget.widget.visible)
        .map((widget) => {
          const { x, y, w, h, i } = widget.widget;
          return { x, y, w, h, i };
        }) as Layout[],
    };
    setLayouts(newWidgets);
  }, [widgets]);

  const widgetComponentMap = new Map(Widgets.map((w) => [w.name, w.component]));

  const renderWidget = (l: any) => {
    // Find the corresponding widget for layout 'l'
    const currentWidget = widgets.find(
      (widget) => widget.widget.i === l.i,
    )?.widget;

    // If no corresponding widget is found, return null early
    if (!currentWidget) {
      return null;
    }

    // Retrieve the component only once using the pre-built map
    const WidgetComponent = widgetComponentMap.get(currentWidget.widget_name);

    // Return the JSX for the rendered widget
    return (
      <div key={l.i} className="h-fit">
        <div className="h-full">
          <Widget title={currentWidget.widget_name}>
            {WidgetComponent && <WidgetComponent />}
          </Widget>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[90%] w-full p-2">
      <ResponsiveGridLayout
        layouts={layouts}
        onBreakpointChange={handleBreakpointChange}
        onLayoutChange={handleLayoutChange}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        compactType={compactType}
        preventCollision={!compactType}
        rowHeight={300}
        cols={cols}
        className="h-full w-full"
      >
        {layouts.lg && layouts.lg.map(renderWidget)}
      </ResponsiveGridLayout>
    </div>
  );
};
