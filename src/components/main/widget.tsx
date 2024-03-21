import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { useContext, type ReactNode } from "react";
import { MdClose } from "react-icons/md";
import Button from "../ui/tw-button";
import { LayoutContext } from "@/context/layout-context";
import { api } from "@/trpc/react";
import { WidgetType } from "@/config/type";

export const Widget = ({
  title,

  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  const { user, widgets, setWidgets } = useContext(LayoutContext);
  const updateWidget = api.widget.updateWidgetById.useMutation();

  const clickHandler = (title: string) => {
    const index = widgets.findIndex(
      (widget) => widget.widget.widget_name === title,
    );
    const item = widgets.find((widget) => widget.widget.widget_name === title);
    if (index < 0 || item === undefined) return;
    if (user)
      updateWidget.mutateAsync({
        ...item.widget,
        visible: !item.widget.visible,
      });
    else {
      const widgets = JSON.parse(
        localStorage.getItem("widgets") as string,
      ) as Array<WidgetType>;
      const updatedWidgets = widgets.map((widget) => {
        if (widget.widget_id === item.widget.widget_id)
          return {
            ...item.widget,
            visible: !widget.visible,
          };
        return widget;
      });

      localStorage.setItem("widgets", JSON.stringify(updatedWidgets));
    }
    const newWidgets = widgets.map((widget, idx) => {
      if (idx !== index) return widget;
      return {
        ...widget,
        widget: {
          ...widget.widget,
          visible: !widget.widget.visible,
        },
      };
    });
    setWidgets(newWidgets);
  };

  return (
    <div className="flex h-full select-none flex-col items-center   rounded-3xl border border-gray-700 bg-[#1d2631] p-3">
      <div className="flex h-10 w-full  justify-between border-b border-gray-700 p-2">
        <p className=" cursor-move text-green-400">{title}</p>
        <Dialog>
          <DialogTrigger>
            <MdClose className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent>
            <p>Are you sure close this widget ?</p>
            <div className="flex justify-end gap-2">
              <Button
                name="Okay"
                className="z-[50]"
                onClick={() => {
                  clickHandler(title);
                }}
              />
              <DialogTrigger>
                <Button name="Cancel" />
              </DialogTrigger>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="h-full w-full overflow-y-auto p-3">{children}</div>
    </div>
  );
};
