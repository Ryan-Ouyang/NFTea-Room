import { Client, PrivateKey, UserAuth, ThreadID, KeyInfo } from "@textile/hub";

export const keyInfo: KeyInfo = {
  key: "buyh2yjxxheyvgkd7zijwlcmm5m",
  secret: "bp52erpfqyi5d72ttlorne4bdfenkuxxwytla2za",
};

export const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Suggestion",
  type: "object",
  properties: {
    _id: { type: "string" },
    NFT_ID: { type: "string" },
    new_price: { type: "number" },
    comments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          identity: {
            type: "string",
          },
          content: {
            type: "string",
          },
        },
      },
    },
  },
};

export const dbThreadID =
  "bafksuyczsxgl3p6mlwk5qwx6jtcsvuftl7y5y2t4xj7j2qxhtpaod5i";
export const dbCollectionID = "Suggestions";

export type Suggestion = {
  NFT_ID: string;
  new_price: number;
  comments: object[];
};
