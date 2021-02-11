import { Contract } from "@ethersproject/contracts";

export default async function sponsorProposal(
  instance: Contract,
  proposalId: number
): Promise<any> {
  try {
    console.log("Proposal Id", proposalId);
    let response = await instance.sponsorProposal(proposalId);
    let result = await response.wait();
    console.log(JSON.stringify(result));
    for (let event of result.events) {
      if (event.event === "SponsorProposal") {
        return event.args[3].toNumber();
      }
    }
  } catch (e) {
    console.error(e);
  }
}
