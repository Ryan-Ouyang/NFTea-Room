import { Client, PrivateKey, UserAuth, ThreadID, KeyInfo } from "@textile/hub";
import { useEffect, useState } from "react";
import {
  dbCollectionID,
  dbThreadID,
  keyInfo,
  schema,
} from "../textile-helpers";

export default function Textile() {
  // Textile stuff
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
      name: dbCollectionID,
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
