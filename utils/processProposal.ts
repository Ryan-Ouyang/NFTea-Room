import { Contract } from "web3-eth-contract";
import { Proposal } from "../modals/proposal";

// Process the Proposal
export default async function processProposal(
  proposalIndex: Number,
  instance: Contract
): Promise<any> {
  try {
    await instance.methods.processProposal(proposalIndex).call();
  } catch (err) {
    console.log(err);
  }
}
