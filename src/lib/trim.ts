import { type Address } from "viem";
import fromExponential from "from-exponential";

export function trim(addr: Address): string {
  return addr.slice(0, 6) + "...." + addr.slice(-4);
}

export function formatBalance(
  bal: number | string,
  precision?: number,
): string {
  const array = fromExponential(bal).split(".");
  if (array.length === 1) return fromExponential(bal);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  array.push(array.pop().substring(0, precision ?? 3));
  const trimmedNumber = array.join(".");
  return trimmedNumber;
}
