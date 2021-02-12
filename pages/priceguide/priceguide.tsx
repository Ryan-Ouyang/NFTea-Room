import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../Header";

export default function PriceTracker() {
  const router = useRouter();
  const [tempPriceTracker, setTempPriceTracker] = useState([]);
  const temp = [
    { id: "1", price: 1 },
    { id: "2", price: 2 },
    { id: "3", price: 3 },
    { id: "4", price: 4 },
    { id: "5", price: 5 },
    { id: "6", price: 6 },
    { id: "17", price: 17 },
  ];
  const handleChange = (e) => {
    const result = temp.filter((value) => value.id!.startsWith(e.target.value));
    setTempPriceTracker(result);
  };
  useEffect(() => {
    setTempPriceTracker(temp);
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
          {tempPriceTracker.map(({ id, price }, index) => {
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
                  Cryptopunk #{id}: Ξ{price}
                </Typography>
                <img
                  src={
                    "https://www.larvalabs.com/cryptopunks/cryptopunk" +
                    id +
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
