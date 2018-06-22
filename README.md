# hdwallet-interface
A simple interface for hdwallets. Created with Ethereum keys in mind, however this should be extendable to any cryptocurrency that BIP44 can work with (an idea of that can be found with SLIP44 listing).

## given an extended public key
(assuming given an `account` level key)

### (offline mode)
  - derive paths and tag accounts / address indexes (ie. `account` is "engineering org", `address_index` is "hosting costs for 2018")
  - display the ETH addresses (and if storing data, whatever is available about balances)

### (online mode)
  - explore `addresses_index` until a gap of 20 has been reached that are unused
  - display the ETH addresses, link to etherscan, show total ETH balance and transaction count
  - all offline mode features


## given an extended private key OR mnemonic
(assuming given hdwallet root key)

### (offline mode)
  - all offline mode features for public key cases
  - sign transactions
  - store / export derived account extended public keys for online usage in "public mode"

### (online mode)
  - probably just warn that they are online.. signing should only be allowed in an offline state

## tech needed
- be able to detect online or offline
- some kind of local storage, to store `account` path extended public keys for ease of use
- some kind of export schema for `account` path extended public keys for ease of use

## future thoughts
- if this is used for an organization, likely they will want an easy way to export for audit purposes
  * this could be a feature that the year is part of the path
  * this could be determined based on transactions sent / received with a timestamp filter
- a trusted server could hold the extended public keys, to provide on-demand reporting
  * this could be tied to an event watcher that sends notifications when a transaction includes one of the ethereum addresses

## TODO

### discover accounts
- search for used addresses (20 indexes is the gap limit)
