import { Contract } from "@ethersproject/contracts";
import { Vote } from "../modals/vote";

export default async function submitVote(
  instance: Contract,
  proposalIndex: number,
  vote: Vote
): Promise<void> {
  let uintVote: number;

  console.log("Trying to submit vote on proposal index: " + proposalIndex);
  if (vote === Vote.Null) {
    uintVote = 0;
  } else if (vote === Vote.Yes) {
    uintVote = 1;
  } else {
    uintVote = 2;
  }
  try {
    const response = await instance.submitVote(proposalIndex, uintVote, {
      gasLimit: 400000,
    });
    await response.wait();
  } catch (e) {
    console.error(e);
  }
}
