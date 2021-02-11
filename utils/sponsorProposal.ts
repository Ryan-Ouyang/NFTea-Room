import { Contract } from "@ethersproject/contracts";

export default async function sponsorProposal(
  instance: Contract,
  proposalId: number
): Promise<void> {
  try {
    const sponsoredProposal = await instance.methods.sponsorProposal(
      proposalId
    );
    console.log(sponsoredProposal);
  } catch (e) {
    console.error(e);
  }
}
