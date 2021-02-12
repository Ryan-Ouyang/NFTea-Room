import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import { request, gql } from "graphql-request";

export const getPriceTracker = async () => {
  const query = gql`
    {
      priceTrackers {
        id
        nftId
        price
      }
    }
  `;

  const graphData = await request(
    "https://api.thegraph.com/subgraphs/name/sneh1999/pricetracker",
    query
  );
  let result = [];
  for (let pt of graphData.priceTrackers) {
    if (!result.some((r) => r.nftId === pt.nftId)) {
      result.push({
        nftId: pt.nftId,
        price: pt.price,
      });
    }
  }
  return result;
};

export default function PriceTracker() {
  const router = useRouter();
  const [tempPriceTracker, setTempPriceTracker] = useState([]);
  const [priceTracker, setPriceTracker] = useState([]);

  const handleChange = (e) => {
    if (priceTracker.length > 0) {
      const result = priceTracker.filter((value) =>
        value.nftId.startsWith(e.target.value)
      );
      setTempPriceTracker(result);
    }
  };
  useEffect(() => {
    getPriceTracker().then((result) => {
      setPriceTracker(result);
      setTempPriceTracker(result);
    });
  }, []);

  return (
    <div>
      <Header name="NFTea Room" title="Price Guide" />
      <div
        style={{
          margin: "auto",
          marginTop: "5%",
        }}
      >
        <TextField
          label="NFT ID"
          id="outlined-size-normal"
          onChange={(e) => handleChange(e)}
          variant="outlined"
          type="text"
          style={{ width: "70%", marginLeft: "15%", marginBottom: "5%" }}
        />

        <div className="grid grid-cols-5">
          {tempPriceTracker.map(({ nftId, price }, index) => {
            return (
              <div
                className="m-2 border border-gray-200 rounded"
                key={index}
                onClick={() => router.push(`/proposals/details/${index}`)}
              >
                <Typography
                  variant="h6"
                  component="h5"
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    width: "100%",
                  }}
                >
                  Cryptopunk #{nftId}: Ξ{price}
                </Typography>
                <img
                  src={
                    "https://www.larvalabs.com/cryptopunks/cryptopunk" +
                    nftId +
                    ".png"
                  }
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    width: "100%",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
