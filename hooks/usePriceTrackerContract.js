import pricetrackerABI from "../contracts/abis/PriceTracker.json";
import useContract from "./useContract";

export default function usePriceTrackerContract(contractAddress) {
  return useContract(contractAddress, pricetrackerABI, true);
}
