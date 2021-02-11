import molochABI from "../contracts/abis/Molochv2.1.json";

export default function useDaoHausContract(contractAddress) {
  return useContract(contractAddress, molochABI);
}
