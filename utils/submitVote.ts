import { Contract } from "web3-eth-contract";
import { Vote } from "../modals/vote";

export default async function submitVote(
  instance: Contract,
  proposalIndex: number,
  vote: Vote
): Promise<void> {
  let uintVote: number;

  if (vote === Vote.Null) {
    uintVote = 0;
  } else if (vote === Vote.Yes) {
    uintVote = 1;
  } else {
    uintVote = 2;
  }

  const submittedVote = await instance.methods
    .submitVote(proposalIndex, uintVote)
    .call();

  console.log(submittedVote);
}
