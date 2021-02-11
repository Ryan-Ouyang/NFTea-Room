import molochABI from "../contracts/abis/Molochv2.1.json";
import useContract from "./useContract";

export default function useDaoHausContract(contractAddress) {
  return useContract(contractAddress, molochABI, true);
}
