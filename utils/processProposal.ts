import { Contract } from "@ethersproject/contracts";

// Process the Proposal
export default async function processProposal(
  proposalIndex: Number,
  instance: Contract
): Promise<any> {
  try {
    await instance.processProposal(proposalIndex);
  } catch (err) {
    console.error(err);
  }
}
