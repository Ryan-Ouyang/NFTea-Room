export default interface ProposeUpdatePriceActionOptions {
  actionTo: string;
  actionValue: number;
  nftId: number;
  price: number;
  details: string;
  paymentRequested: number;
  sharesRequested: number;
}
