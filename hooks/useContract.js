// import { Contract } from "@ethersproject/contracts";
import { Contract } from "web3-eth-contract";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";

export default function useContract(address, ABI) {
  return useMemo(() => {
    if (address && ABI) {
      return new Contract(ABI, address);
    }
    return undefined;
  }, [address, ABI]);
}
