import { Client, KeyInfo, PrivateKey, ThreadID } from "@textile/hub";
import { BigNumber, utils } from "ethers";
import { createContext, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { keyInfo, dbThreadID } from "../textile-helpers";

export const TextileContext = createContext({} as any);
export const TextileProvider = ({ children }) => {
  const { account, library } = useWeb3React();

  const [client, setClient] = useState(undefined);
  const [identity, setIdentity] = useState(undefined);

  async function connectToTextile() {
    const client = await Client.withKeyInfo(keyInfo);
    setClient(client);
    console.log("Successfully init Textile client:");
    console.log(client);

    await connectToMetamask();
    console.log(
      "Successfully connected to metamask with identity: " + identity
    );

    const token = await client.getToken(identity);
    console.log("Successfully got token: " + token);

    const dbInfo = await client.getDBInfo(ThreadID.fromString(dbThreadID));
    console.log("Got DB:" + dbInfo.toString());

    try {
      await client.joinFromInfo(dbInfo);
    } catch (e) {
      console.log(e);
    }
  }

  async function connectToMetamask() {
    function generateMessageForEntropy(
      ethereum_address: string,
      application_name: string,
      secret: string
    ): string {
      return (
        "******************************************************************************** \n" +
        "READ THIS MESSAGE CAREFULLY. \n" +
        "DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND WRITE \n" +
        "ACCESS TO THIS APPLICATION. \n" +
        "DO NOT SIGN THIS MESSAGE IF THE FOLLOWING IS NOT TRUE OR YOU DO NOT CONSENT \n" +
        "TO THE CURRENT APPLICATION HAVING ACCESS TO THE FOLLOWING APPLICATION. \n" +
        "******************************************************************************** \n" +
        "The Ethereum address used by this application is: \n" +
        "\n" +
        ethereum_address +
        "\n" +
        "\n" +
        "\n" +
        "By signing this message, you authorize the current application to use the \n" +
        "following app associated with the above address: \n" +
        "\n" +
        application_name +
        "\n" +
        "\n" +
        "\n" +
        "The hash of your non-recoverable, private, non-persisted password or secret \n" +
        "phrase is: \n" +
        "\n" +
        secret +
        "\n" +
        "\n" +
        "\n" +
        "******************************************************************************** \n" +
        "ONLY SIGN THIS MESSAGE IF YOU CONSENT TO THE CURRENT PAGE ACCESSING THE KEYS \n" +
        "ASSOCIATED WITH THE ABOVE ADDRESS AND APPLICATION. \n" +
        "AGAIN, DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND \n" +
        "WRITE ACCESS TO THIS APPLICATION. \n" +
        "******************************************************************************** \n"
      );
    }

    const metamask = { address: account, signer: library.getSigner() };
    const message = generateMessageForEntropy(
      metamask.address,
      "textile-ETHPack",
      "secret"
    );
    const signedText = await metamask.signer.signMessage(message);
    const hash = utils.keccak256(signedText);
    if (hash === null) {
      throw new Error(
        "No account is provided. Please provide an account to this application."
      );
    }
    const array = hash
      // @ts-ignore
      .replace("0x", "")
      // @ts-ignore
      .match(/.{2}/g)
      .map((hexNoPrefix) => BigNumber.from("0x" + hexNoPrefix).toNumber());
    if (array.length !== 32) {
      throw new Error(
        "Hash of signature is not the correct size! Something went wrong!"
      );
    }
    const identity = PrivateKey.fromRawEd25519Seed(Uint8Array.from(array));
    setIdentity(identity);
  }

  return (
    <TextileContext.Provider
      value={{
        client,
        identity,
        connectToTextile,
      }}
    >
      {children}
    </TextileContext.Provider>
  );
};
