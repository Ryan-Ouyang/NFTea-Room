import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import useEagerConnect from "../hooks/useEagerConnect";
import { TextileContext } from "../contexts/textile";
import { useContext, useEffect, useState } from "react";
import { getSuggestions } from "./api/textile/getSuggestions";

export default function Home(props) {
  // ETH Stuff
  const { account, library } = useWeb3React();
  const triedToEagerConnect = useEagerConnect();
  const isConnected = typeof account === "string" && !!library;

  // Textile Stuff
  const { client, connectToTextile } = useContext(TextileContext);

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
            <button onClick={() => connectToTextile()}>
              Connect to Textile
            </button>
          </section>
        )}

        <section>
          {props.suggestions.map((suggestion) => {
            return <div>{suggestion.toString()}</div>;
          })}
        </section>
      </main>

      <style jsx>{`
        main {
          text-align: center;
        }
      `}</style>

      <style jsx global>{`
        body {
          margin: 0;
        }

        html {
          font-family: sans-serif, Apple Color Emoji, Segoe UI Emoji,
            Segoe UI Symbol, Noto Color Emoji;
          line-height: 1.5;
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
