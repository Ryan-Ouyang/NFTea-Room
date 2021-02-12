import { ThreadID } from "@textile/hub";
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
import { dbCollectionID, dbThreadID } from "../textile-helpers";
import { getSuggestions } from "./api/textile/getSuggestions";

export default function Home(props) {
  const router = useRouter();
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
  // TODO: Change the details according to the proposal

  // Initialize Daohaus contract
  const daoHaus = useDaoHausContract(constants.DAO_CONTRACT_ADDRESS);
  // Initialize Minion contract
  const minion = useMinionContract(constants.MINION_CONTRACT_ADDRESS);
  // Initialize PriceTracker contract
  const pricetracker = usePriceTrackerContract(
    constants.PRICETRACKER_CONTRACT_ADDRESS
  );

  // Textile Stuff
  const { client, connectToTextile, token } = useContext(TextileContext);

  // Submit Votes
  // TODO: Only works with yes right now
  // const submitVotes = async () => {
  //   try {
  //     await submitVote(daoHaus, proposalIndex, Vote.Yes);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

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

      <nav className="flex flex-row items-center p-3 md:px-16 border-b-2">
        <div>NFTea Room</div>
        <div className="flex-grow"></div>
        <Account triedToEagerConnect={triedToEagerConnect} />
        {isConnected && !client && (
          <>
            <button
              className="ml-6 p-2 rounded border-2 border-black hover:text-blue-700"
              onClick={() => connectToTextile()}
            >
              Connect to Textile
            </button>
          </>
        )}
        {isConnected && client && (
          <button
            className="ml-6 p-2 rounded border-2 border-black hover:text-blue-700"
            onClick={() => router.push("/proposals/create")}
          >
            Submit Proposal
          </button>
        )}
      </nav>

      <main>
        <section>
          {suggestions.map(({ _id, nft_id, new_price, comments }, index) => {
            return (
              <div className="suggestion" key={index}>
                <h1>Name: {nft_id}</h1>
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
