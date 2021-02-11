import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import useEagerConnect from "../hooks/useEagerConnect";
import useDaoHausContract from "../hooks/useDaoHausContract";
import { TextileContext } from "../contexts/textile";
import React, { useContext, useEffect, useState } from "react";
import { getSuggestions } from "./api/textile/getSuggestions";
import { Field, Form, Formik } from "formik";
import { ThreadID } from "@textile/hub";
import CreateProposalOptions from "../modals/createProposalOptions";
import { dbCollectionID, dbThreadID, Suggestion } from "../textile-helpers";
import createProposal from "../utils/submitProposal";
import sponsorProposal from "../utils/sponsorProposal";
import submitVote from "../utils/submitVote";
import { Vote } from "../modals/vote";
import processProposal from "../utils/processProposal";

export default function Home(props) {
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    props.suggestions && setSuggestions(props.suggestions);
  }, []);

  // ETH Stuff
  const { account, library } = useWeb3React();
  const triedToEagerConnect = useEagerConnect();
  const isConnected = typeof account === "string" && !!library;
  const [isSubmittedProposal, setIsSubmittedProposal] = useState(false);
  const [proposalIndex, setProposalIndex] = useState(0);
  const [isVotedProposal, setIsVotedProposal] = useState(false);

  // TODO: Change the details according to the proposal
  // Create Proposal options
  const cp: CreateProposalOptions = {
    applicant: account,
    sharesRequested: 0,
    lootRequested: 0,
    tributeOffered: 0,
    tributeToken: "0xebaadba116d4a72b985c3fae11d5a9a7291a3e70",
    paymentRequested: 100000000,
    paymentToken: "0xebaadba116d4a72b985c3fae11d5a9a7291a3e70",
    details: "abcdef",
  };

  // Initialize Daohaus contract
  const daoHaus = useDaoHausContract(
    "0x3b9ad1e37a00d5430faeef38ad4aaefbd895091f"
  );

  // Textile Stuff
  const { client, connectToTextile, token } = useContext(TextileContext);

  // Submit Proposal
  const submitProposal = async () => {
    try {
      let proposalId = await createProposal(daoHaus, cp);
      let _proposalIndex = await sponsorProposal(daoHaus, proposalId);
      setProposalIndex(_proposalIndex);
      setIsSubmittedProposal(true);
    } catch (err) {
      console.log(err);
    }
  };

  // Submit Votes
  // TODO: Only works with yes right now

  const submitVotes = async () => {
    try {
      await submitVote(daoHaus, proposalIndex, Vote.Yes);
      setTimeout(() => {
        // functions
        setIsVotedProposal(true);
      }, 4 * 60 * 1000);
    } catch (err) {
      console.error(err);
    }
  };

  // Process Proposal

  const processProposals = async () => {
    try {
      await processProposal(proposalIndex, daoHaus);
    } catch (error) {
      console.log(error);
    }
  };
  const createSuggestion = async (data: any) => {
    const suggestion: Suggestion = {
      NFT_ID: data.NFT_ID,
      new_price: data.new_price,
      comments: [],
    };

    const result = await client.create(
      ThreadID.fromString(dbThreadID),
      dbCollectionID,
      [suggestion]
    );

    alert("Successfully created proposal");
    setSuggestions(await getSuggestions());
  };

  const addComment = async (index: number, data: any) => {
    const suggestion = suggestions[index];

    suggestion.comments.push({
      identity: account,
      content: data.text,
    });

    const result = await client.save(
      ThreadID.fromString(dbThreadID),
      dbCollectionID,
      [suggestion]
    );

    alert("Successfully created comment");
    setSuggestions(await getSuggestions());
  };

  return (
    <div>
      <Head>
        <title>ETHPack.tf</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Account triedToEagerConnect={triedToEagerConnect} />

        {isConnected && (
          <section>
            <ETHBalance />

            {/* Textile */}
            {!client && (
              <div>
                <button onClick={() => connectToTextile()}>
                  Connect to Textile
                </button>
                {!isSubmittedProposal ? (
                  // If Proposal has not been submitted
                  <button onClick={() => submitProposal()}>
                    Submit Proposal
                  </button>
                ) : !isVotedProposal ? (
                  // If votes have not been submitted
                  <button onClick={() => submitVotes()}>Submit Vote</button>
                ) : (
                  // If Proposal has not been processed
                  <button onClick={() => processProposals()}>
                    Process Proposal
                  </button>
                )}
              </div>
            )}

            {client && token && (
              <Formik
                initialValues={{ NFT_ID: "", new_price: 0 }}
                onSubmit={(values, { setSubmitting }) => {
                  createSuggestion(values);
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <label>NFT_ID:</label>
                    <Field type="text" name="NFT_ID" />
                    <br />
                    <label>new_price:</label>
                    <Field type="number" name="new_price" />
                    <br />
                    <button type="submit" disabled={isSubmitting}>
                      Submit
                    </button>
                  </Form>
                )}
              </Formik>
            )}
          </section>
        )}

        <section>
          {suggestions.map(({ _id, NFT_ID, new_price, comments }, index) => {
            console.log(comments);
            return (
              <div className="suggestion" key={index}>
                <h1>Name: {NFT_ID}</h1>
                <p>New price: {new_price}</p>
                <div>
                  {comments.map(({ identity, content }) => (
                    <div>
                      <p>ID: {identity}</p>
                      <p>Comment: {content}</p>
                    </div>
                  ))}
                </div>
                <div>
                  {client && token && (
                    <Formik
                      initialValues={{ text: "" }}
                      onSubmit={(values, { setSubmitting, resetForm }) => {
                        addComment(index, values);
                        resetForm();
                        setSubmitting(false);
                      }}
                    >
                      {({ isSubmitting }) => (
                        <Form>
                          <Field type="text" name="text" />
                          <button type="submit" disabled={isSubmitting}>
                            Comment
                          </button>
                        </Form>
                      )}
                    </Formik>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <style jsx>{`
        main {
          text-align: center;
        }

        .suggestion {
          text-align: center;
          border: 1px solid black;
          max-width: 600px;
          margin: 0 auto;
        }
      `}</style>

      <style jsx global>{`
        body {
          margin: 0;
        }

        html {
          font-family: sans-serif, Apple Color Emoji, Segoe UI Emoji,
            Segoe UI Symbol, Noto Color Emoji;
        }

        *,
        *::after,
        *::before {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps(context) {
  const data = await getSuggestions();
  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      suggestions: data,
    }, // will be passed to the page component as props
  };
}
