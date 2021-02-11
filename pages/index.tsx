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
import { dbThreadID, Suggestion } from "../textile-helpers";
import CreateProposalOptions from "../modals/createProposalOptions";
import submitProposal from "../utils/submitProposal";

export default function Home(props) {
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    setSuggestions(props.suggestions);
  }, []);

  // ETH Stuff
  const { account, library } = useWeb3React();
  const triedToEagerConnect = useEagerConnect();
  const isConnected = typeof account === "string" && !!library;

  // const daohaus = useDaoHausContract(
  //   "0xc33a4efecb11d2cad8e7d8d2a6b5e7feaccc521d"
  // );
  // console.log(daohaus);

  // const cp: CreateProposalOptions = {
  //   applicant: "0x0D1f2Bd5351a65a78Ac0BeF3C8fAEf643C046508",
  //   sharesRequested: 0,
  //   lootRequested: 0,
  //   tributeOffered: 0,
  //   tributeToken: "0x81d6967ca79138d07be57aee855485a14ae33891",
  //   paymentRequested: 0,
  //   paymentToken: "0x81d6967ca79138d07be57aee855485a14ae33891",
  //   details: "abcdef",
  // };

  // useEffect(() => {
  //   submitProposal(daohaus, cp)
  //     .then((a) => {
  //       console.log(a);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  // Textile Stuff
  const { client, connectToTextile, token } = useContext(TextileContext);

  const createSuggestion = async (data: any) => {
    const suggestion: Suggestion = {
      NFT_ID: data.NFT_ID,
      new_price: data.new_price,
    };

    const result = await client.create(
      ThreadID.fromString(dbThreadID),
      "Price-Suggestions",
      [suggestion]
    );

    alert("Successfully created proposal");
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
              <button onClick={() => connectToTextile()}>
                Connect to Textile
              </button>
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
          {suggestions.map(({ NFT_ID, new_price }) => {
            return (
              <div className="suggestion">
                <h1>Name: {NFT_ID}</h1>
                <p>New price: {new_price}</p>
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
