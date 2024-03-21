"use client";
import dynamic from "next/dynamic";
import { LayoutSetting } from "@/components/layout-setting";
import { useEffect, useState } from "react";
import { LayoutContext } from "@/context/layout-context";
import {
  defaultAssociation,
  defaultLayout,
  defaultWidgets,
} from "@/config/static";
import type { ILayoutContext, LayoutItemType } from "@/config/type";
import { useAccount } from "wagmi";
import { api } from "@/trpc/react";

import { useSession } from "next-auth/react";

const WidgetContainer = dynamic(
  () =>
    import("../components/main/widget-container").then(
      (module) => module.WidgetContainer,
    ),
  { ssr: false },
);

export default function Home() {
  const { address } = useAccount();
  const session = useSession();
  const [user, setUser] = useState<number | null>(null);
  const [layouts, setLayouts] = useState<LayoutItemType[]>([]);
  const [widgets, setWidgets] = useState<Array<any>>([]);

  const getUser = api.user.getUser.useMutation();
  const getLayoutByUser = api.layout.getLayoutByUserId.useMutation();

  const createUser = api.user.createUser.useMutation();
  const createLayout = api.layout.createLayout.useMutation();
  const createWidget = api.widget.createWidget.useMutation();
  const createAssociation = api.association.createAssociation.useMutation();

  const [currentLayout, setCurrentLayout] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem("layout", JSON.stringify(defaultLayout));
    localStorage.setItem(
      "widgets",
      JSON.stringify(
        defaultWidgets.map((_, idx) => {
          return {
            ..._,
            widget_id: idx + 1,
          };
        }),
      ),
    );
    localStorage.setItem("associations", JSON.stringify(defaultAssociation));
    localStorage.setItem("layoutsNumber", "1");
    localStorage.setItem("widgetsNumber", "7");
  }, []);

  useEffect(() => {
    if (address) {
      const user = getUser.mutateAsync({ address });
      user
        .then((data) => {
          if (data) setUser(data.user_id);
          else {
            const newUser = createUser.mutateAsync({
              address,
            });
            newUser
              .then((newUser) => {
                setUser(newUser.user_id);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return () => {
      setUser(null);
    }
  }, [address]);

  useEffect(() => {

    if (user) {
      getLayoutByUser.mutate(
        { user_id: user },
        {
          onSuccess: (data) => {
            let fetchedLayouts = data;
            if (!fetchedLayouts.length) {
              createLayout
                .mutateAsync({
                  layout_name: "Default",
                  user_id: user,
                })
                .then((newLayout) => {
                  fetchedLayouts.push({
                    layout_id: newLayout.layout_id,
                    layout_name: newLayout.layout_name,
                  });
                  defaultWidgets.forEach((item) => {
                    createWidget
                      .mutateAsync(item)
                      .then((newWidget) => {
                        createAssociation.mutate({
                          widget_id: newWidget.widget_id,
                          layout_id: newLayout.layout_id,
                        });
                      })
                      .catch((err) => console.error(err));
                  });
                  setLayouts(fetchedLayouts);
                })
                .catch((err) => console.error(err));
            } else setLayouts(fetchedLayouts);
          },
          onError: (err) => {
            console.error(err);
          },
        },
      );
    } else {
      const layouts = JSON.parse(localStorage.getItem("layout") as string);
      setLayouts(layouts);
    }
  }, [user]);

  const context: ILayoutContext = {
    user: user ?? 0,
    layouts,
    setLayouts,
    current: currentLayout,
    setCurrentLayout: setCurrentLayout,
    widgets: widgets,
    setWidgets: setWidgets,
  };

  console.log(session)
  return (
    <LayoutContext.Provider value={context}>
      {
        session.status == 'authenticated' &&
        <main className="flex flex-col items-center justify-center">
          <div className="flex h-16 min-h-16 w-full items-center justify-end border-b border-gray-700 bg-[#1d2631] pr-4">
            <LayoutSetting />
          </div>
          <div className="w-full ">
            <WidgetContainer />
          </div>
        </main>
      }

    </LayoutContext.Provider>
  );
}
