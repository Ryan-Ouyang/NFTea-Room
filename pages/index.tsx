import { Breadcrumbs, Button, Typography } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import { Field, Form, Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Account from "../components/Account";
import * as constants from "../constants";
import { TextileContext } from "../contexts/textile";
import useDaoHausContract from "../hooks/useDaoHausContract";
import useEagerConnect from "../hooks/useEagerConnect";
import useMinionContract from "../hooks/useMinionContract";
import usePriceTrackerContract from "../hooks/usePriceTrackerContract";
import { getSuggestions } from "./api/textile/getSuggestions";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import getProposalFlagsById from "../utils/getProposalFlagsById";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Home() {
  const router = useRouter();
  const classes = useStyles();
  const [suggestions, setSuggestions] = useState([]);
  const [isNotProcessed, setIsNotProcessed] = useState({});
  const moloch = useDaoHausContract(constants.DAO_CONTRACT_ADDRESS);

  useEffect(() => {
    getSuggestions().then((res) => {
      const notProcessed = {};
      console.log(`Fetching flags for ${res.length} suggestions`);
      for (let s of res) {
        getProposalFlagsById(moloch, s.proposal_id).then((flags) => {
          console.log(s.proposal_id, flags);
          if (flags && flags[0] && !flags[1]) {
            notProcessed[s.proposal_id] = true;
          }
        });
      }
      setIsNotProcessed(notProcessed);
      setSuggestions(res);
    });
  }, []);

  // ETH Stuff
  const { account, library } = useWeb3React();
  const triedToEagerConnect = useEagerConnect();
  const isConnected = typeof account === "string" && !!library;

  // Textile Stuff
  const { client, connectToTextile, token } = useContext(TextileContext);

  return (
    <div>
      <Head>
        <title>NFTea Room</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Button
              onClick={() => {
                router.push("/");
              }}
            >
              <Typography variant="h6" style={{ color: "white" }}>
                NFTea Room
              </Typography>
            </Button>
            <div className="flex-grow"></div>
            <Button
              onClick={() => router.push("/priceguide/priceguide")}
              style={{ color: "white", marginRight: "10px" }}
              variant="outlined"
            >
              Price Tracker
            </Button>
            {isConnected && !client && (
              <>
                <Button
                  onClick={() => connectToTextile()}
                  style={{ color: "white" }}
                  variant="outlined"
                >
                  Connect to Textile
                </Button>
              </>
            )}
            {isConnected && client && (
              <Button
                onClick={() => router.push("/proposals/create")}
                style={{ color: "white" }}
                variant="outlined"
              >
                Submit Proposal
              </Button>
            )}
            <div className="flex-grow"></div>
            <Account triedToEagerConnect={triedToEagerConnect} />
          </Toolbar>
        </AppBar>
      </div>

      <main>
        <Typography
          variant="h5"
          component="h5"
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            width: "100%",
            marginTop: "1em",
          }}
        >
          Currently Active Proposals
        </Typography>
        <section className="container mx-auto mt-6">
          <div className="grid grid-cols-4">
            {suggestions.map(
              ({ _id, nft_id, new_price, proposal_id }, index) => {
                if (isNotProcessed[proposal_id]) {
                  console.log(isNotProcessed);
                  return (
                    <div
                      className="m-2 border border-gray-200 rounded cursor-pointer"
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
                        <strong>Name</strong>: Cryptopunk #{nft_id}
                      </Typography>
                      <img
                        src={
                          "https://www.larvalabs.com/cryptopunks/cryptopunk" +
                          nft_id +
                          ".png"
                        }
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          display: "flex",
                          width: "100%",
                        }}
                      />
                      <div className="p-2">
                        <Breadcrumbs separator="›" aria-label="breadcrumb">
                          <Typography color="textPrimary">
                            <strong>Price</strong>
                          </Typography>
                          <Typography color="textPrimary">Ξ1</Typography>

                          <Typography color="textPrimary">
                            Ξ{new_price}
                          </Typography>
                        </Breadcrumbs>
                      </div>
                    </div>
                  );
                }
              }
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

// export async function getServerSideProps(context) {
//   const data = await getSuggestions();
//   if (!data) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       suggestions: data,
//     }, // will be passed to the page component as props
//   };
// }
