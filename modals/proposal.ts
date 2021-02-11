import  {Vote} from './vote'
export interface Proposal {
    applicant : string; // the applicant who wishes to become a member - this key will be used for withdrawals (doubles as guild kick target for gkick proposals)
    proposer : string; // the account that submitted the proposal (can be non-member)
    sponsor: string; // the member that sponsored the proposal (moving it into the queue)
    sharesRequested: Number; // the # of shares the applicant is requesting
    lootRequested: Number ; // the amount of loot the applicant is requesting
    tributeOffered: Number; // the amount of tokens offered as tribute
    tributeToken : string; // thetribute token contract reference
    paymentRequested : Number; // the amount of tokens requested as payment
    paymentToken: string; // thepayment token contract reference
    startingPeriod : Number; // the period in which voting can start for this proposal
    yesVotes: Number; // the total number of YES votes for this proposal
    noVotes: Number; // the total number of NO votes for this proposal
    flags: Boolean[]; // [sponsored, processed, didPass, cancelled, whitelist, guildkick]
    details:string; // proposal details - could be IPFS hash, plaintext, or JSON
    maxTotalSharesAndLootAtYesVote : Number; // the maximum # of total shares encountered at a yes vote on this proposal
    votesByMember: Record<string,Vote> ; // the votes on this proposal by each member
}