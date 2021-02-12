import { Client, PrivateKey, ThreadID, QueryJSON, Where } from "@textile/hub";
import { NextApiRequest, NextApiResponse } from "next";
import { dbCollectionID, dbThreadID, keyInfo } from "../../../textile-helpers";

export const getSuggestions = async (): Promise<any[]> => {
  const client = await Client.withKeyInfo(keyInfo);
  const token = await client.getToken(PrivateKey.fromRandom());

  return await client.find(ThreadID.fromString(dbThreadID), dbCollectionID, {});
};

export const getSuggestionById = async (id: string): Promise<any> => {
  const client = await Client.withKeyInfo(keyInfo);
  const token = await client.getToken(PrivateKey.fromRandom());

  const query = new Where("_id").eq(id);
  return await client.find(
    ThreadID.fromString(dbThreadID),
    dbCollectionID,
    query
  );
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = getSuggestions();
  res.json(result);
};

export default handler;
