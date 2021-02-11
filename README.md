This is a starter template for [Learn Next.js](https://nextjs.org/learn).

Uses boilerplate: https://github.com/mirshko/next-web3-boilerplate

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
