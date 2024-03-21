import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { type TCryptoHoldingRes } from "@/config/type";
import { formatBalance } from "@/lib/trim";
import Image from "next/image";
import LoadingIcons from "react-loading-icons";
import { useAccount } from "wagmi";

export const PortfolioTracker = () => {
  const { address } = useAccount();
  const { isLoading, data: data } = useQuery({
    queryKey: ["wallet assets portfolio"],
    queryFn: () =>
      fetch(
        `https://api.mobula.io/api/1/wallet/portfolio?wallet=${address}`,
      ).then((res) => res.json() as unknown as TCryptoHoldingRes),
  });

  
  if (!address) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>Please connect wallet to view your assets</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingIcons.TailSpin />
      </div>
    );
  } else
    return (
      <div className="flex min-h-40 w-full justify-center">
        {data && (
          <div className="flex-grow">
            <p className="py-3">
              Total USD : {formatBalance(data.data?.total_wallet_balance) ?? 0}
            </p>
            <div className="flex flex-col gap-2">
              {data.data?.assets.map((item, index) => (
                <div
                  key={index}
                  className="flex  flex-grow items-center justify-between rounded-xl border border-gray-500 p-1 px-4"
                >
                  <div className="flex">
                    <Image
                      src={item.asset.logo}
                      alt="token-logo"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    <div className="ml-3">
                      <p>{item.asset.name}</p>
                      <p>{formatBalance(item.price)}$</p>
                    </div>
                  </div>
                  <div>
                    <p>
                      {formatBalance(item.token_balance)} {item.asset.symbol}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
};
