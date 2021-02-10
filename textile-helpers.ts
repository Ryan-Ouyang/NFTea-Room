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
  },
};

export const dbThreadID =
  "bafk4oufbotvljpizzljskscjeg42wcgmfxbqsibtzy6fotrxtjobvzy";

export type Suggestion = {
  NFT_ID: string;
  new_price: number;
};
