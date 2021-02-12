import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import { default as React, useContext, useEffect, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

export default function PriceTracker() {
  const router = useRouter();

  const tempPriceTracker = [
    { id: 1, price: 1 },
    { id: 2, price: 2 },
    { id: 3, price: 3 },
    { id: 4, price: 4 },
    { id: 5, price: 5 },
    { id: 6, price: 6 },
    { id: 7, price: 7 },
  ];
  return (
    <Autocomplete
      id="combo-box-demo"
      options={tempPriceTracker}
      getOptionLabel={(option) => option.id.toString()}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Price" variant="outlined" />
      )}
    />
  );
}
