import {
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as constants from "../../../constants";
import useDaoHausContract from "../../../hooks/useDaoHausContract";
import useMinionContract from "../../../hooks/useMinionContract";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { ThreadID } from "@textile/hub";
import { useWeb3React } from "@web3-react/core";
import { Field, Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { TextileContext } from "../../../contexts/textile";
import { Vote } from "../../../modals/vote";
import { dbCollectionID, dbThreadID } from "../../../textile-helpers";
import {
  getSuggestionById,
  getSuggestions,
} from "../../api/textile/getSuggestions";
import Comment from "../../Comment";
import Header from "../../Header";
import submitVote from "../../../utils/submitVote";
import executeAction from "../../../utils/executeAction";
import processProposal from "../../../utils/processProposal";
import getProposalFlagsById from "../../../utils/getProposalFlagsById";
import getProposalVotes from "../../../utils/getProposalVotes";

const useStyles = makeStyles({
  root: {
    minWidth: "80%",
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
});

export default function Details({ proposal }) {
  const classes = useStyles();

  const moloch = useDaoHausContract(constants.DAO_CONTRACT_ADDRESS);
  const minion = useMinionContract(constants.MINION_CONTRACT_ADDRESS);

  const { account, library } = useWeb3React();
  const { client, token } = useContext(TextileContext);
  const [hasVoted, setHasVoted] = useState(false);
  const [commentText, setCommentText] = useState("");

  const {
    _id,
    nft_id,
    new_price,
    comments,
    proposal_id,
    proposal_index,
    details,
  } = proposal;
  const [currComments, setCurrComments] = useState(comments);
  const [proposalFlags, setProposalFlags] = useState([]);
  const [yesVotes, setYesVotes] = useState(0);
  const [noVotes, setNoVotes] = useState(0);

  useEffect(() => {
    getProposalFlagsById(moloch, proposal_id).then((flags) => {
      getProposalVotes(moloch, proposal_id).then((res) => {
        setProposalFlags(flags);
        setYesVotes(res.yesVotes);
        setNoVotes(res.noVotes);
      });
    });
  }, []);

  async function handleVote(vote: Vote) {
    try {
      await submitVote(moloch, proposal_index, vote);
      setHasVoted(true);
      let flags = await getProposalFlagsById(moloch, proposal_id);
      setProposalFlags(flags);
      let votes = await getProposalVotes(moloch, proposal_id);
      setYesVotes(votes.yesVotes);
      setNoVotes(votes.noVotes);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleProcess() {
    try {
      await processProposal(proposal_index, moloch);
      await executeAction(minion, proposal_id);
      let flags = await getProposalFlagsById(moloch, proposal_id);
      setProposalFlags(flags);
      let votes = await getProposalVotes(moloch, proposal_id);
      setYesVotes(votes.yesVotes);
      setNoVotes(votes.noVotes);
    } catch (e) {
      console.error(e);
    }
  }

  function handleTextChange(e) {
    setCommentText(e.target.value);
  }

  const addComment = async (data: any) => {
    proposal.comments.push({
      identity: account,
      content: commentText,
    });

    const result = await client.save(
      ThreadID.fromString(dbThreadID),
      dbCollectionID,
      [proposal]
    );

    console.log("Successfully created comment");
    //const suggestion = await getSuggestionById(_id);
    setCurrComments(proposal.comments);
    setCommentText("");
  };

  return (
    <div>
      <Header name="NFTea Room" title="Suggestion Details" />
      <br />
      <br />
      <Box
        component="span"
        m={1}
        style={{
          width: "80%",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Card
          className={classes.root}
          style={{
            display: "flex",
            width: "80%",
            margin: "auto",
          }}
          variant="outlined"
        >
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              Cryptopunk #{nft_id}
            </Typography>
            <Typography variant="body2" component="p">
              {details}
            </Typography>
            <br />
            <Breadcrumbs
              separator="›"
              aria-label="breadcrumb"
              style={{ marginLeft: "39%" }}
            >
              <Typography color="textPrimary">
                <strong>Price</strong>
              </Typography>
              <Typography color="textPrimary">Ξ1</Typography>

              <Typography color="textPrimary">Ξ{new_price}</Typography>
            </Breadcrumbs>
            <br />
            <Typography color="textPrimary">Yes Votes: {yesVotes}</Typography>
            <br />
            <Typography color="textPrimary">No Votes: {noVotes}</Typography>
            <br />
            {proposalFlags && proposalFlags[0] && !proposalFlags[1] ? (
              <>
                <ButtonGroup
                  variant="contained"
                  color="primary"
                  aria-label="contained primary button group"
                  style={{ marginLeft: "40%" }}
                >
                  <Button
                    style={{ backgroundColor: "green" }}
                    onClick={() => handleVote(Vote.Yes)}
                  >
                    <ThumbUpIcon />
                  </Button>
                  <Button
                    style={{ backgroundColor: "darkred" }}
                    onClick={() => handleVote(Vote.No)}
                  >
                    <ThumbDownIcon />
                  </Button>
                </ButtonGroup>
                <br />
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "36%" }}
                  onClick={() => handleProcess()}
                >
                  Process Proposal
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      </Box>
      <div>
        {currComments &&
          currComments.map(({ identity, content }, i) => (
            <Comment key={i} identity={identity} content={content} />
          ))}
      </div>
      <div>
        {client && token && (
          <Formik
            initialValues={{ text: "" }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              addComment(values);
              resetForm();
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <br />
                <TextField
                  variant="outlined"
                  type="text"
                  name="text"
                  onChange={(e) => handleTextChange(e)}
                  value={commentText}
                  placeholder="Comment..."
                  style={{
                    width: "80%",
                    marginLeft: "10%",
                  }}
                />
                <br />
                <br />
                <Button
                  color="primary"
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  style={{
                    marginLeft: "42%",
                  }}
                >
                  Comment
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const { id } = query;

  const data = await getSuggestions();
  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      proposal: data[id],
    }, // will be passed to the page component as props
  };
}
