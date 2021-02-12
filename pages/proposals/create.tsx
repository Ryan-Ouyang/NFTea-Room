import { Avatar } from "@material-ui/core";
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
import executeAction from "../../utils/executeAction";
import proposeUpdatePriceAction from "../../utils/proposeUpdatePriceAction";
import { getPunkInfo } from "../api/punk/[pid]";

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

  // TODO: Change the details according to the proposal

  // Initialize Daohaus contract
  const daoHaus = useDaoHausContract(consts.DAO_CONTRACT_ADDRESS);
  const minion = useMinionContract(consts.MINION_CONTRACT_ADDRESS);

  async function submitProposal(data: any) {
    try {
      const options: ProposeUpdatePriceActionOptions = {
        actionTo: consts.PRICETRACKER_CONTRACT_ADDRESS,
        actionValue: 1,
        nftId: data.nft_id,
        price: data.new_price,
        details: "Update Price of #1000",
        paymentRequested: 5,
        sharesRequested: 1,
      };
      let proposalId = await proposeUpdatePriceAction(minion, client, options);
      console.log("Submitted Proposal ID: ", proposalId);
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  }

  async function execute() {
    try {
      await executeAction(minion, 1);
      console.log("Executed proposal id 1");
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  }

  // // DAO - Submit Proposal
  // const submitProposal = async () => {
  //   try {
  //     let proposalId = await createProposal(daoHaus, cp);
  //     let _proposalIndex = await sponsorProposal(daoHaus, proposalId);
  //     setProposalIndex(_proposalIndex);
  //     setIsSubmittedProposal(true);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // // Textile - Create Proposal
  // const createSuggestion = async (data: any) => {
  //   const suggestion: Suggestion = {
  //     nft_id: data.nft_id,
  //     new_price: data.new_price,
  //     comments: [],
  //     proposal_id: 1,
  //     proposal_index: 1,
  //   };

  //   const result = await client.create(
  //     ThreadID.fromString(dbThreadID),
  //     dbCollectionID,
  //     [suggestion]
  //   );

  //   alert("Successfully created proposal");
  //   router.push("/");
  // };

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
    <Card
      className={classes.root}
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        marginTop: "10%",
        width: "100%",
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
            punkInfo !== null && punkInfo !== undefined ? punkInfo.imageUrl : ""
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
            />
          </div>
          <div
            style={{
              paddingTop: "5px",
              paddingLeft: "10px",
            }}
            // onSubmit={(values) => {
            //   // setSubmitting(false);
            //   console.log(values);
            //   submitProposal(values);
            // }}
          >
            <Button variant="contained" color="secondary">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
