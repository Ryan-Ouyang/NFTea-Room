import { Contract } from "@ethersproject/contracts";

export default async function getProposalFlagsById(
  instance: Contract,
  proposalId: number
): Promise<boolean[]> {
  try {
    const response = await instance.getProposalFlags(proposalId);
    return response;
  } catch (e) {
    console.error(e);
  }
}
