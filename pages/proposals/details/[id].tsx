import { ThreadID } from "@textile/hub";
import { useWeb3React } from "@web3-react/core";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { TextileContext } from "../../../contexts/textile";
import { dbThreadID, dbCollectionID } from "../../../textile-helpers";
import {
  getSuggestionById,
  getSuggestions,
} from "../../api/textile/getSuggestions";

export default function Details({ proposal }) {
  const router = useRouter();

  const { account, library } = useWeb3React();
  const { client, connectToTextile, token } = useContext(TextileContext);

  const { _id, nft_id, new_price, comments } = proposal;
  const [currComments, setCurrComments] = useState([]);
  useEffect(() => {
    comments && setCurrComments(comments);
  }, []);

  const addComment = async (data: any) => {
    proposal.comments.push({
      identity: account,
      content: data.text,
    });

    const result = await client.save(
      ThreadID.fromString(dbThreadID),
      dbCollectionID,
      [proposal]
    );

    alert("Successfully created comment");
    const suggestion = await getSuggestionById(_id);
    setCurrComments(suggestion.comments);
  };

  return (
    <div>
      <div>
        {comments.map(({ identity, content }) => (
          <div>
            <p>ID: {identity.substring(0, 5)}...</p>
            <p>Comment: {content}</p>
          </div>
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
