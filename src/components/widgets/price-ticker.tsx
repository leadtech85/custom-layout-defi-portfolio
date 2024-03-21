import { useEffect, useState } from "react";
import LoadingIcons from "react-loading-icons";
import { HorizontalTicker } from "@/components/infinite-ticker/horizontal-ticker";
import { formatBalance } from "@/lib/trim";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import clsx from "clsx";

type TPriceData = {
  logo: string;
  name: string;
  price: string;
  price_change_24h: string;
};
type TState = {
  data: TPriceData[];
};

const PriceItem = (props: TPriceData) => {
  return (
    <div className="flex min-w-56 items-center justify-around gap-2 rounded-2xl border border-gray-700 p-2 ">
      <Image
        src={props.logo}
        width={32}
        height={32}
        alt="token-logo"
        className="object-contain"
      />
      <div>
        <div className="flex gap-2">
          <p className="whitespace-nowrap">{props.name} </p>
          <p
            className={clsx(
              "whitespace-nowrap text-xs",
              Number(props.price_change_24h).valueOf() > 0
                ? "text-lime-500"
                : "text-red-500",
            )}
          >
            {formatBalance(props.price_change_24h, 4)}%
          </p>
        </div>
        <p>{formatBalance(props.price, 3)}$</p>
      </div>
    </div>
  );
};

export default function PriceTicker() {
  const { isLoading, data: priceData } = useQuery({
    queryKey: ["token price ticker"],
    queryFn: () =>
      fetch(
        "https://api.mobula.io/api/1/market/multi-data?assets=Bitcoin,Ethereum,Tether,BNB,SOL,XRP,USDC,Cardano,Avalanche,Dogecoin,TRON",
      ).then((res) => res.json()),
    refetchInterval: 60000,
  });

  const [vState, setState] = useState<TState>({ data: [] });

  useEffect(() => {
    if (!!priceData?.data) {
      const temp = Object.values(
        priceData?.data,
      ) as unknown as Array<TPriceData>;
      if (temp != vState.data) setState((prev) => ({ ...prev, data: temp }));
    }
  }, [priceData]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingIcons.TailSpin />
      </div>
    );
  } else {
    return (
      <div className="mt-4 flex flex-col gap-5">
        <HorizontalTicker duration={30000}>
          <div className="mx-2 flex flex-row gap-4">
            {vState.data?.map((item, index) => (
              <PriceItem
                key={index}
                logo={item.logo}
                name={item.name}
                price_change_24h={item.price_change_24h}
                price={item.price}
              />
            ))}
          </div>
        </HorizontalTicker>
        <HorizontalTicker reverse duration={30000}>
          <div className="mx-2 flex flex-row gap-4">
            {vState.data?.map((item, index) => (
              <PriceItem
                key={index}
                logo={item.logo}
                name={item.name}
                price_change_24h={item.price_change_24h}
                price={item.price}
              />
            ))}
          </div>
        </HorizontalTicker>
      </div>
    );
  }
}
