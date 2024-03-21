import { PortfolioTracker } from "@/components/widgets/crypto-portfolio-tracker";
import type React from "react";
import AnalogClocks from "@/components/widgets/analog-clock";
import PriceTicker from "@/components/widgets/price-ticker";
import RssReader from "@/components/widgets/rss-reader";
import QuotesWidget from "@/components/widgets/quotes";
import EmbeddedWidget from "@/components/widgets/embed";
import CryptoPriceChart from "@/components/widgets/crypto-price-chart";

export interface IWidget {
  key: string;
  name: string;
  description: string;
  mandatory: boolean;
  component: React.FC;
}

export const Widgets = [
  {
    key: "analogClock",
    name: "Analog Clocks",
    description: "Analog Clocks",
    mandatory: false,
    component: AnalogClocks,
  },
  {
    key: "embedWidget",
    name: "Embed Widget",
    description: "Embed Widget",
    mandatory: true,
    component: EmbeddedWidget,
  },
  {
    key: "quotes",
    name: "Quotes",
    description: "Quotes",
    mandatory: true,
    component: QuotesWidget,
  },
  {
    key: "rssReader",
    name: "RSS News Reader",
    description: "RSS News Reader",
    mandatory: true,
    component: RssReader,
  },
  {
    key: "stockChart",
    name: "Crypto StockChart",
    description: "Crypto StockChart",
    mandatory: false,
    component: CryptoPriceChart,
  },
  {
    key: "portfolioTracker",
    name: "Crypto Portfolio Tracker",
    description: "Crypto Portfolio Tracker",
    mandatory: false,
    component: PortfolioTracker,
  },
  {
    key: "priceTicker",
    name: "Crypto Price Ticker",
    description: "Crypto Price Ticker",
    mandatory: false,
    component: PriceTicker,
  },
];
