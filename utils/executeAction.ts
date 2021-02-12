import { Contract } from "@ethersproject/contracts";
export default async function executeAction(
  instance: Contract,
  proposalId: number
) {
  try {
    let response = await instance.executeAction(proposalId, {
      gasLimit: 300000,
    });

    await response.wait();

    console.log(`Executed action for proposalId ${proposalId} successfully!`);
  } catch (e) {
    console.error(e);
  }
}
