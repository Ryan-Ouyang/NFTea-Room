import { Contract } from "@ethersproject/contracts";

// Process the Proposal
export default async function processProposal(
  proposalIndex: Number,
  instance: Contract
): Promise<any> {
  try {
    let response = await instance.processProposal(proposalIndex);
    await response.wait();
  } catch (err) {
    console.error(err);
  }
}
