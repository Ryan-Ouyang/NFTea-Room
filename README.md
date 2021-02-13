Submitted to ETHDenver 2021 (won Open Track finalist, Textile, DAOHaus, and IPFS prizes).
Devfolio link: https://devfolio.co/submissions/nftea-room-5944

## Workflow

### NFTea Token

- Deploy the contract

### DAO

- Deploy DAO through DAOHaus
- Set period length and voting periods etc to a couple minutes at most
- Whitelist the `NFTea` token
- Mint `NFTea` to the DAO

### Minion

- Modified Minion contract to include `paymentRequested` and `sharesRequested` as part of `proposeAction`
- Deploy blank `Minion` first
- Deploy `MinionFactory` with `template = address(Minion)` second
- Call `summonMinion` on MinionFactory
- Fund some ETH to minion
- Call `proposalId := proposeAction`
- DAO `proposalIdx := sponsorProposal` `submitVote(proposalIdx)` and `processProposal(proposalIdx)`
- Call `executeAction(proposalId)`
