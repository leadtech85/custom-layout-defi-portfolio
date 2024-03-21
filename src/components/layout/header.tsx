/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import { useWeb3ModalEvents, useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { signIn, signOut } from "next-auth/react";

import { trim } from "@/lib/trim";

const Header = () => {
  const { open } = useWeb3Modal();
  const { address } = useAccount();

  const events = useWeb3ModalEvents()

  const hooksEvent = async () => {
    try {
      if (events?.data?.event == 'CONNECT_SUCCESS') {
        await signIn("credentials", {
          redirect: false,
          walletAddress: address
        });
      } else if (events?.data?.event == 'MODAL_CLOSE' && !events?.data?.properties.connected) {
        await signOut()
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    hooksEvent()
  }, [events])

  return (
    <div className="border-b-grey-500 flex h-16 min-h-16 items-center  justify-between px-2 md:px-7">
      <div className="item-center flex justify-center gap-2">
        {/* <img src="/svg/logo.svg" alt="logo" className="h-6 w-6 md:h-8 md:w-8" /> */}
        <div className="flex items-center justify-center">
          <p className="font-mono text-lg font-bold">CUSTOM LAYOUT DEFI</p>
        </div>
      </div>
      <div className="flex md:gap-4">
        <button
          onClick={() => open()}
          className="flex gap-3 rounded-xl border border-zinc-600 px-4 py-2 "
        >
          <img src="/svg/metamask.svg" alt="logo" className="h-6 w-6" />
          {address ? trim(address) : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
};

export default Header;
