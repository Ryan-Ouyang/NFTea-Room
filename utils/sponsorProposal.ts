import { Contract } from "@ethersproject/contracts";
import { ThreadID } from "@textile/hub";
import ProposeUpdatePriceActionOptions from "../modals/proposeUpdatePriceActionOptions";
import { dbCollectionID, dbThreadID, Suggestion } from "../textile-helpers";

export default async function sponsorProposal(
  instance: Contract,
  proposalId: number,
  textileClient: any,
  options: ProposeUpdatePriceActionOptions
): Promise<any> {
  try {
    let response = await instance.sponsorProposal(proposalId);
    let result = await response.wait();
    for (let event of result.events) {
      if (event.event === "SponsorProposal") {
        let proposalIndex = event.args[3].toNumber();
        const suggestion: Suggestion = {
          nft_id: options.nftId.toString(),
          new_price: options.price,
          comments: [],
          proposal_id: proposalId,
          proposal_index: proposalIndex,
        };

        await textileClient.create(
          ThreadID.fromString(dbThreadID),
          dbCollectionID,
          [suggestion]
        );
        return proposalIndex;
      }
    }
  } catch (e) {
    console.error(e);
  }
}
