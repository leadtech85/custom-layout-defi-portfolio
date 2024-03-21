"use client";

import * as React from "react";
import { RiLayout5Fill, RiDeleteBin2Line } from "react-icons/ri";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";

import { Button } from "./ui/button";
import { api } from "@/trpc/react";
import { Input } from "./ui/input";
import { WidgetType } from "@/config/type";
import { LayoutContext } from "@/context/layout-context";

export const LayoutSetting: React.FC = () => {
  const {
    user,
    layouts,
    widgets,
    current,
    setLayouts,
    setWidgets,
    setCurrentLayout,
  } = React.useContext(LayoutContext);

  const [isCreating, setCreating] = React.useState<boolean>(false);
  const [layoutName, setLayoutName] = React.useState<string>("");

  const getWidgetsByLayoutId =
    api.association.getWidgetIdByLayoutId.useMutation();
  const updateWidget = api.widget.updateWidgetById.useMutation();
  const createLayout = api.layout.createLayout.useMutation();
  const createWidget = api.widget.createWidget.useMutation();
  const createAssociation = api.association.createAssociation.useMutation();
  const deleteLayout = api.layout.deleteLayout.useMutation();
  const widgetContextUpdate = () => {
    const currentLayoutId = layouts[current]?.layout_id;
    if (currentLayoutId) {
      if (user) {
        getWidgetsByLayoutId
          .mutateAsync({ layout_id: currentLayoutId })
          .then((widgets) => {
            setWidgets(widgets);
          })
          .catch((err) => console.error(err));
      } else {
        const associations = JSON.parse(
          localStorage.getItem("associations") as string,
        ) as Array<{ layout_id: number; widget_id: number }>;
        const widgets = JSON.parse(localStorage.getItem("widgets") as string);
        if (associations && widgets) {
          const Widgets = widgets.filter((widget: any) =>
            associations
              .filter((_) => _.layout_id === currentLayoutId)
              .map((association: any) => association.widget_id)
              .includes(widget.widget_id),
          );
          setWidgets(
            Widgets.map((_: any) => {
              return { layout_id: currentLayoutId, widget: _ };
            }),
          );
        }
      }
    }
    setLayoutName("");
  };

  React.useEffect(widgetContextUpdate, [current, layouts]);

  const selectHandler = (value: string) => {
    setCurrentLayout(Number(value));
  };

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newValue = event.target.value;
    setLayoutName(newValue);
  };

  const clickHandler = () => {
    if (isCreating) {
      if (user) {
        createLayout
          .mutateAsync({ layout_name: layoutName, user_id: user })
          .then((newlayout) => {
            const newLayoutContext = layouts.concat({
              layout_id: newlayout.layout_id,
              layout_name: newlayout.layout_name,
            });
            setLayouts(newLayoutContext);

            widgets
              .map((widget) => widget.widget)
              .map((item) => {
                const { widget_id, ...rest } = item;

                return rest;
              })
              .map((widget) => {
                createWidget.mutateAsync(widget).then((rlt) => {
                  createAssociation.mutateAsync({
                    layout_id: newlayout.layout_id,
                    widget_id: rlt.widget_id,
                  });
                });
              });
          });
      } else {
        const newId =
          (JSON.parse(
            localStorage.getItem("layoutsNumber") as string,
          ) as number) + 1;

        const layout = layouts.concat({
          layout_id: newId,
          layout_name: layoutName,
        });
        setLayouts(layout);

        let widgetsList = JSON.parse(
          localStorage.getItem("widgets") as string,
        ) as Array<WidgetType>;
        let nextWidgetId = JSON.parse(
          localStorage.getItem("widgetsNumber") as string,
        ) as number;

        let associations = JSON.parse(
          localStorage.getItem("associations") as string,
        ) as Array<{ layout_id: number; widget_id: number }>;

        widgets
          .map((widget) => widget.widget)
          .map((widget) => {
            const { widget_id, ...rest } = widget;
            nextWidgetId++;
            widgetsList.push({ widget_id: nextWidgetId, ...rest });
            associations.push({ layout_id: newId, widget_id: nextWidgetId });
          });

        localStorage.setItem("widgets", JSON.stringify(widgetsList));
        localStorage.setItem("widgetsNumber", JSON.stringify(nextWidgetId));
        localStorage.setItem("associations", JSON.stringify(associations));
        localStorage.setItem("layout", JSON.stringify(layout));
        localStorage.setItem("layoutsNumber", JSON.stringify(newId));
      }
    }

    setCreating(!isCreating);
  };

  const checkChangeHandler = (item: any, index: number) => {
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

  const deleteHandler = (layout_id: number) => {
    if (user) {
      deleteLayout
        .mutateAsync({ layout_id })
        .then((rlt) => {
          if (rlt) {
            const newLayout = layouts.filter(
              (layout) => layout_id !== layout.layout_id,
            );
            setLayouts(newLayout);
          }
        })
        .catch((err) => console.error(err));
    } else {
      const layouts = JSON.parse(
        localStorage.getItem("layout") as string,
      ) as Array<{
        layout_id: number;
        layout_name: number;
      }>;

      const associations = JSON.parse(
        localStorage.getItem("associations") as string,
      ) as Array<{ layout_id: number; widget_id: number }>;

      const layoutsNumber =
        (JSON.parse(
          localStorage.getItem("layoutsNumber") as string,
        ) as number) - 1;

      const newLayouts = layouts
        .filter((layout) => layout.layout_id !== layout_id)
        .map((layout, index) => {
          return {
            layout_id: index + 1,
            layout_name: layout.layout_name,
          };
        });

      const newAssociations = associations.filter(
        (association) => association.layout_id != layout_id,
      );

      setLayouts(newLayouts);

      localStorage.setItem("associations", JSON.stringify(newAssociations));
      localStorage.setItem("layoutsNumber", JSON.stringify(layoutsNumber));
      localStorage.setItem("layout", JSON.stringify(newLayouts));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <RiLayout5Fill className="h-8 w-8 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4 mt-4 w-80 border-none bg-[#0F1723] p-4 text-white">
        <DropdownMenuGroup className="mb-[20px] flex gap-[5px]">
          {!isCreating ? (
            <Select value={current.toString()} onValueChange={selectHandler}>
              <SelectTrigger className="border-slate-800 outline-none">
                <SelectValue placeholder="Select Layout" />
              </SelectTrigger>
              <SelectContent className="w-full items-stretch border-slate-800 bg-[#0f1723] text-white">
                {layouts.map((item, index) => (
                  <div className="relative" key={index}>
                    <SelectItem value={index.toString()} key={item.layout_id}>
                      {item.layout_name}
                    </SelectItem>
                    {item.layout_name != "Default" && (
                      <span
                        className="absolute right-7 top-1/3 z-[1000] flex h-3.5 w-3.5 items-center justify-center"
                        onClick={() => {
                          deleteHandler(item.layout_id);
                        }}
                      >
                        <RiDeleteBin2Line
                          color="white"
                          className="cursor-pointer"
                        />
                      </span>
                    )}
                  </div>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type="text"
              placeholder="New Layout"
              className="border-slate-800"
              value={layoutName}
              onChange={inputHandler}
            />
          )}
          <Button
            className="border !border-slate-800"
            variant="ghost"
            onClick={clickHandler}
          >
            {!isCreating ? "Create" : "Done"}
          </Button>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Layouts</DropdownMenuLabel>
          {widgets.map((item, index) => (
            <DropdownMenuCheckboxItem
              key={index}
              checked={item.widget.visible}
              tabIndex={-1}
              onCheckedChange={() => {
                checkChangeHandler(item, index);
              }}
              onKeyDown={(e) => {
                e.preventDefault();
              }}
              onSelect={(e) => e.preventDefault()}
            >
              {item.widget.widget_name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
