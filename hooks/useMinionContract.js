import minionABI from "../contracts/abis/Minion.json";
import useContract from "./useContract";

export default function useMinionContract(contractAddress) {
  return useContract(contractAddress, minionABI, true);
}
