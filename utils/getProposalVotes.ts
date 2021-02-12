import { Contract } from "@ethersproject/contracts";

export default async function getProposalVotes(
  instance: Contract,
  proposalId: number
): Promise<any> {
  try {
    const response = await instance.proposals(proposalId);
    let yesVotes = response[10].toNumber();
    let noVotes = response[11].toNumber();
    return {
      yesVotes,
      noVotes,
    };
  } catch (e) {
    console.error(e);
  }
}
