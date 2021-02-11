import { Contract } from "web3-eth-contract";

export default async function sponsorProposal(
  instance: Contract,
  proposalId: number
): Promise<void> {
  const sponsoredProposal = await instance.methods
    .sponsorProposal(proposalId)
    .call();

  console.log(sponsoredProposal);
}
