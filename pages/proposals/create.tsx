import { Avatar, CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import { default as React, useContext, useEffect, useState } from "react";
import * as consts from "../../constants";
import { TextileContext } from "../../contexts/textile";
import useDaoHausContract from "../../hooks/useDaoHausContract";
import useMinionContract from "../../hooks/useMinionContract";
import ProposeUpdatePriceActionOptions from "../../modals/proposeUpdatePriceActionOptions";
import PunkInfo from "../../modals/PunkInfo";
import proposeUpdatePriceAction from "../../utils/proposeUpdatePriceAction";
import sponsorProposal from "../../utils/sponsorProposal";
import { getPunkInfo } from "../api/punk/[pid]";
// import Bubbles from "./Bubbles.jsx";
import Header from "../Header";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(50),
    height: theme.spacing(50),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "2000em",
  },
}));

export default function Create() {
  const router = useRouter();
  const [punkInfo, setPunkInfo] = useState<PunkInfo>(null);
  const { client, connectToTextile, token } = useContext(TextileContext);
  const { account, library } = useWeb3React();
  const isConnected = typeof account === "string" && !!library;
  const classes = useStyles();
  const [isSubmittedProposal, setIsSubmittedProposal] = useState(false);
  const [proposalIndex, setProposalIndex] = useState(0);
  const [details, setDetails] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  // TODO: Change the details according to the proposal

  // Initialize Daohaus contract
  const daoHaus = useDaoHausContract(consts.DAO_CONTRACT_ADDRESS);
  const minion = useMinionContract(consts.MINION_CONTRACT_ADDRESS);

  async function submitProposal() {
    try {
      setIsSubmittedProposal(true);
      const options: ProposeUpdatePriceActionOptions = {
        actionTo: consts.PRICETRACKER_CONTRACT_ADDRESS,
        actionValue: 1,
        nftId: parseInt(punkInfo.info.id),
        price: newPrice,
        details: details,
        paymentRequested: 5,
        sharesRequested: 1,
      };
      let proposalId = await proposeUpdatePriceAction(minion, options);
      let _proposalIndex = await sponsorProposal(
        daoHaus,
        proposalId,
        client,
        options
      );
      setProposalIndex(_proposalIndex);
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (!isConnected || !client || !token) {
      console.error("You are not connected to MetaMask or Textile");
      router.push("/");
    }
  }, []);

  const handleGetNFT = async (value: any) => {
    if (isNaN(parseInt(value))) {
      setPunkInfo(null);
    } else {
      try {
        let response = await getPunkInfo(parseInt(value));
        let body: PunkInfo = response;
        setPunkInfo(body);
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div>
      {/* <Bubbles color="205,92,92" /> */}
      <Header name="NFTea Room" title="Submit Price Suggestion" />
      <Card
        className={classes.root}
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          margin: "auto",
          marginTop: "10%",
          width: "80%",
          alignSelf: "center",
        }}
        variant="outlined"
      >
        <div>
          <Avatar
            style={{
              marginRight: "100px",
            }}
            alt="Remy Sharp"
            src={
              punkInfo !== null && punkInfo !== undefined
                ? punkInfo.imageUrl
                : ""
            }
            className={classes.large}
          />
        </div>
        <div>
          <form
            style={{
              width: "100%",
              paddingRight: "20%",
            }}
          >
            <div>
              <TextField
                label="NFT ID"
                id="outlined-size-normal"
                value={punkInfo ? punkInfo.info.id : null}
                onChange={(e) => handleGetNFT(e.target.value)}
                variant="outlined"
                type="number"
              />
            </div>
            <div
              style={{
                paddingTop: "5px",
              }}
            >
              <TextField
                id="outlined-size-normal"
                label="Proposal Description"
                multiline
                placeholder="Please provide valid arguments as to why you think your proposal should be accepted"
                rows={10}
                name="details"
                variant="outlined"
                onChange={(e) => setDetails(e.target.value)}
                style={{ width: 500 }}
              />
            </div>
            <div
              style={{
                paddingTop: "5px",
              }}
            >
              <TextField
                label="New Price"
                id="outlined-size-normal"
                name="newPrice"
                variant="outlined"
                type="number"
                onChange={(e) => setNewPrice(parseInt(e.target.value))}
              />
            </div>
            <div
              style={{
                paddingTop: "5px",
                paddingLeft: "10px",
              }}
            >
              {!isSubmittedProposal ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={submitProposal}
                  disabled={isSubmittedProposal}
                >
                  Submit
                </Button>
              ) : (
                <CircularProgress color="secondary" />
              )}
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
