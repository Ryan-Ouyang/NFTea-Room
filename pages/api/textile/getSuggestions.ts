import { Client, PrivateKey, ThreadID } from "@textile/hub";
import { NextApiRequest, NextApiResponse } from "next";
import { dbThreadID, keyInfo } from "../../../textile-helpers";

export const getSuggestions = async (): Promise<any[]> => {
  const client = await Client.withKeyInfo(keyInfo);
  const token = await client.getToken(PrivateKey.fromRandom());
  // const dbInfo = await client.getDBInfo(ThreadID.fromString(dbThreadID));
  // await client.joinFromInfo(dbInfo);

  return await client.find(
    ThreadID.fromString(dbThreadID),
    "Price-Suggestions",
    {}
  );
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = getSuggestions();
  res.json(result);
};

export default handler;
