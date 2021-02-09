import { NextApiRequest, NextApiResponse } from "next";
import { request, gql } from "graphql-request";
import cryptopunks from "../../../json/cryptopunks.json";

type PunkInfo = {
  gender: "Male" | "Female";
  accessories: string[];
  imageUrl?: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { pid },
  } = req;

  const query = gql`
  {
    cryptoPunks(where: {id: "${pid}"}) {
      id
      transferedTo {
        id
      }
      purchase {
        id
      }
      assignedTo {
        id
      }
      bid {
        id
        bid
        bidder
      }
      offer {
        id
        offeredBy {
          id
        }
        amountOffered
      }
    }
  }`;

  let punkInfo = cryptopunks[pid as string] as PunkInfo;
  punkInfo.imageUrl = `https://www.larvalabs.com/cryptopunks/cryptopunk${pid}.png`;

  const graphData = await request(
    "https://api.thegraph.com/subgraphs/name/itsjerryokolo/cryptopunks",
    query
  );

  res.json({
    punkInfo: punkInfo,
    queryData: graphData,
  });
};
