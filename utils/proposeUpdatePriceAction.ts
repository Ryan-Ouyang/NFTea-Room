import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "ethers";
import ProposeUpdatePriceActionOptions from "../modals/proposeUpdatePriceActionOptions";

// Propose an action to the Minion (returns proposalId)
export default async function proposeUpdatePriceAction(
  instance: Contract,
  options: ProposeUpdatePriceActionOptions
): Promise<any> {
  try {
    let dataString = "0x10e689ab"; // 0x10e689ab is method ID for updatePrice
    let param1HexString = decimalToHex(options.nftId, 64);
    let param2HexString = decimalToHex(options.price, 64);

    dataString = dataString + param1HexString + param2HexString;

    let response = await instance.proposeAction(
      options.actionTo,
      options.actionValue,
      dataString,
      options.details,
      options.paymentRequested,
      options.sharesRequested,
      {
        gasLimit: 300000,
      }
    );
    let result = await response.wait();

    for (let event of result.events) {
      if (event.event === "ProposeAction") {
        return (event.args[0] as BigNumber).toNumber();
      }
    }
  } catch (e) {
    console.error(e);
  }
}

function decimalToHex(d: number, padding: number): string {
  var hex = Number(d).toString(16);
  padding =
    typeof padding === "undefined" || padding === null
      ? (padding = 2)
      : padding;

  while (hex.length < padding) {
    hex = "0" + hex;
  }

  return hex;
}
