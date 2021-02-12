import { NextApiRequest, NextApiResponse } from "next";
import { request, gql } from "graphql-request";
import cryptopunks from "../../../json/cryptopunks.json";

type PunkInfo = {
  gender: "Male" | "Female";
  accessories: string[];
  imageUrl?: string;
  info: CryptoPunk;
};

type CryptoPunk = {
  id: string;
  owner: {
    id: string;
  };
  transferedTo?: {
    id: string;
  };
  assignedTo?: {
    id: string;
  };
  bid?: Bid[];
  offer?: Offer[];
};

type Bid = {
  id: string;
  bid: string;
  bidder: string;
};

type Offer = {
  id: string;
  offeredBy: {
    id: string;
  };
  amountOffered: string;
};

export const getPunkInfo = async (pid: number) => {
  const query = gql`
  {
    cryptoPunks(where: {id: "${pid}"}) {
      id
      owner {
        id
      }
      transferedTo {
        id
      }
      assignedTo {
        id
      }
      bid {
        bid
        bidder
      }
      offer {
        offeredBy {
          id
        }
        amountOffered
      }
    }
  }`;

  let punkInfo = cryptopunks[pid.toString()] as PunkInfo;
  punkInfo.imageUrl = `https://www.larvalabs.com/cryptopunks/cryptopunk${pid}.png`;

  const graphData = await request(
    "https://api.thegraph.com/subgraphs/name/itsjerryokolo/cryptopunks",
    query
  );

  punkInfo.info = (graphData.cryptoPunks as CryptoPunk[])[0];

  return punkInfo;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { pid },
  } = req;

  const punkId = Number(pid);

  return res.json(await getPunkInfo(punkId));
};
export default handler;
