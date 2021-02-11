import { ThreadID } from "@textile/hub";
import { useWeb3React } from "@web3-react/core";
import { Field, Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { TextileContext } from "../../contexts/textile";
import useDaoHausContract from "../../hooks/useDaoHausContract";
import CreateProposalOptions from "../../modals/createProposalOptions";
import { Suggestion, dbThreadID, dbCollectionID } from "../../textile-helpers";
import sponsorProposal from "../../utils/sponsorProposal";
import createProposal from "../../utils/submitProposal";
import { useRouter } from "next/router";

export default function Create() {
  const router = useRouter();

  const { client, connectToTextile, token } = useContext(TextileContext);
  const { account, library } = useWeb3React();
  const isConnected = typeof account === "string" && !!library;

  const [isSubmittedProposal, setIsSubmittedProposal] = useState(false);
  const [proposalIndex, setProposalIndex] = useState(0);

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

  // DAO - Submit Proposal
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

  // Textile - Create Proposal
  const createSuggestion = async (data: any) => {
    const suggestion: Suggestion = {
      nft_id: data.nft_id,
      new_price: data.new_price,
      comments: [],
      proposal_id: 1,
      proposal_index: 1,
    };

    const result = await client.create(
      ThreadID.fromString(dbThreadID),
      dbCollectionID,
      [suggestion]
    );

    alert("Successfully created proposal");
    router.push("/");
  };

  if (!isConnected || !client || !token) {
    alert("You are not connected to Metamask or Textile");
    router.push("/");
  }

  return (
    <div>
      <section>
        {client && token && (
          <Formik
            initialValues={{ nft_id: "", new_price: 0 }}
            onSubmit={(values, { setSubmitting }) => {
              createSuggestion(values);
              setSubmitting(false);
            }}
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
              </Form>
            )}
          </Formik>
        )}
      </section>
    </div>
  );
}
