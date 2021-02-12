import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useRouter } from "next/router";
import { default as React } from "react";

import Header from "../Header";
export default function PriceTracker() {
  const router = useRouter();

  const tempPriceTracker = [
    { id: 1, price: 1 },
    { id: 2, price: 2 },
    { id: 3, price: 3 },
    { id: 4, price: 4 },
    { id: 5, price: 5 },
    { id: 6, price: 6 },
    { id: 17, price: 17 },
  ];
  return (
    <div>
      <Header name="NFTea Room" title="Price Guide" />
      <div
        style={{
          margin: "auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          marginTop: "10%",
        }}
      >
        <Autocomplete
          id="combo-box-demo"
          options={tempPriceTracker}
          getOptionLabel={(option) => option.id.toString()}
          style={{ width: 1000 }}
          renderInput={(params) => (
            <TextField {...params} label="NftId" variant="outlined" />
          )}
        />
      </div>
    </div>
  );
}
