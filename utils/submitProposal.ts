import { Contract } from "web3-eth-contract";
import { Proposal } from "../modals/proposal";

// Submit Proposal using DaoHause
export default async function createProposal(
  instance: Contract,
  p: Proposal
): Promise<any> {
  try {
    await instance.methods
      .submitProposal(
        p.applicant,
        p.sharesRequested,
        p.lootRequested,
        p.tributeOffered,
        p.tributeToken,
        p.paymentRequested,
        p.paymentToken,
        p.details,
        p.flags
      )
      .call();
  } catch (err) {
    console.log(err);
  }
}
