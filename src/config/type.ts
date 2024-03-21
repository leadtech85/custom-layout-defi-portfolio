export interface ILayoutContext {
  user: number;
  layouts: LayoutItemType[];
  setLayouts: Function;
  current: number;
  setCurrentLayout: Function;
  widgets: Array<WidgetContextType>;
  setWidgets: Function;
}
export type LayoutItemType = {
  layout_name: string;
  layout_id: number;
};

export type WidgetType = {
  widget_id: number;
  widget_name: string;
  widget_description: string;
  visible: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
};

export type WidgetContextType = {
  layout_id: number;
  widget: WidgetType;
};

export type TQuote = {
  text: string;
  author: string;
};

export type TCryptoHoldingRes = {
  data: {
    assets: Array<TAssets>;
    total_wallet_balance: number;
    wallet: string;
  };
};

export type TAssets = {
  asset: {
    name: string;
    symbol: string;
    logo: string;
  };
  price: number;
  token_balance: number;
};

export type TCryptoPrice = {
  name: string;
  symbol: string;
  current_price: number;
  image: string;
};
