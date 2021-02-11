import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "ethers";
import CreateProposalOptions from "../modals/createProposalOptions";

// Submit Proposal using DaoHause
export default async function createProposal(
  instance: Contract,
  p: CreateProposalOptions
): Promise<any> {
  try {
    let response = await instance.submitProposal(
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
    let result = await response.wait();
    for (let event of result.events) {
      if (event.event === "SubmitProposal") {
        return (event.args[9] as BigNumber).toNumber();
      }
    }
    // return response
  } catch (err) {
    console.error(err);
  }
}
