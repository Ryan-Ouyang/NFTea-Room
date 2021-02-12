import { useWeb3React } from "@web3-react/core";
import { randomInt } from "crypto";
import { BigNumber } from "ethers";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import * as consts from "../../constants";
import { TextileContext } from "../../contexts/textile";
import useDaoHausContract from "../../hooks/useDaoHausContract";
import useMinionContract from "../../hooks/useMinionContract";
import ProposeUpdatePriceActionOptions from "../../modals/proposeUpdatePriceActionOptions";
import proposeUpdatePriceAction from "../../utils/proposeUpdatePriceAction";
import executeAction from "../../utils/executeAction";

export default function Create() {
  const router = useRouter();

  const { client, connectToTextile, token } = useContext(TextileContext);
  const { account, library } = useWeb3React();
  const isConnected = typeof account === "string" && !!library;

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

  return (
    <div>
      <section>
        {client && token && (
          <Formik
            initialValues={{ nft_id: "", new_price: 0 }}
            onSubmit={(values, { setSubmitting }) => {
              submitProposal(values);
              setSubmitting(false);
            }}
            // onSubmit={(values) => {
            //   // setSubmitting(false);
            //   console.log(values);
            //   submitProposal(values);
            // }}
          >
            {({ isSubmitting }) => (
              <Form>
                <label>nft_id:</label>
                <Field type="text" name="nft_id" />
                <br />
                <label>new_price:</label>
                <Field type="number" name="new_price" />
                <br />
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
                <button onClick={execute}>Execute</button>
              </Form>
            )}
          </Formik>
        )}
      </section>
    </div>
  );
}
