import { Client, PrivateKey, UserAuth, ThreadID, KeyInfo } from "@textile/hub";
import { useEffect, useState } from "react";

export default function Textile() {
  // Textile stuff

  const keyInfo: KeyInfo = {
    key: "buyh2yjxxheyvgkd7zijwlcmm5m",
    secret: "bp52erpfqyi5d72ttlorne4bdfenkuxxwytla2za",
  };

  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Suggestion",
    type: "object",
    properties: {
      _id: { type: "string" },
      NFT_ID: { type: "string" },
      new_price: { type: "number" },
    },
  };

  const dbThreadID = "bafk4oufbotvljpizzljskscjeg42wcgmfxbqsibtzy6fotrxtjobvzy";

  const [client, setClient] = useState(undefined);
  const [token, setToken] = useState(undefined);

  useEffect(() => {
    setup(keyInfo);
  }, []);

  async function getToken(client: Client, user: PrivateKey) {
    const token = await client.getToken(user);
    setToken(token);
  }

  async function setup(key: KeyInfo) {
    const client = await Client.withKeyInfo(key);
    setClient(client);
    console.log(client);
  }

  async function createDB() {
    const thread: ThreadID = await client.newDB(null, "name");
    console.log(thread.toString());
    return thread;
  }

  async function collectionFromSchema(client: Client) {
    await client.newCollection(ThreadID.fromString(dbThreadID), {
      name: "Price-Suggestions",
      schema: schema,
    });
  }

  return (
    <div>
      <h1>Textile</h1>
      <button onClick={() => getToken(client, PrivateKey.fromRandom())}>
        getToken
      </button>
      <button onClick={() => createDB()}>CreateDB</button>
      <button onClick={() => collectionFromSchema(client)}>
        CreateCollection
      </button>
    </div>
  );
}
