import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return twMerge(clsx(inputs));
}

export function fakeMail() {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return (result + "@fake.com").toLowerCase();
}

export const isValidWalletAddress = (address: string) => {
  // Regular expression for Ethereum wallet address (example)
  const regex = /^(0x)?[0-9a-fA-F]{40}$/;

  // Check if the address matches the regex pattern
  return regex.test(address);
}