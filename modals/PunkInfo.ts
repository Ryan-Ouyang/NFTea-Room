export default interface PunkInfo {
  gender: "Male" | "Female";
  accessories: string[];
  imageUrl?: string;
  info: CryptoPunk;
}

type CryptoPunk = {
  id: string;
  owner: {
    id: string;
  };
  transferedTo?: {
    id: string;
  };
  assignedTo?: {
    id: string;
  };
  bid?: Bid[];
  offer?: Offer[];
};

type Bid = {
  id: string;
  bid: string;
  bidder: string;
};

type Offer = {
  id: string;
  offeredBy: {
    id: string;
  };
  amountOffered: string;
};
