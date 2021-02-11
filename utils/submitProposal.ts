import { Contract } from "@ethersproject/contracts";
import CreateProposalOptions from "../modals/createProposalOptions";

// Submit Proposal using DaoHause
export default async function createProposal(
  instance: Contract,
  p: CreateProposalOptions
): Promise<any> {
  try {
    await instance.submitProposal(
      p.applicant,
      p.sharesRequested,
      p.lootRequested,
      p.tributeOffered,
      p.tributeToken,
      p.paymentRequested,
      p.paymentToken,
      p.details,
      {
        gasLimit: 300000,
      }
    );
  } catch (err) {
    console.error(err);
  }
}
