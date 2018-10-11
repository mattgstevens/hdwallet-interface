# Current status

This is being used by `mattgstevens` as a quick way to work with hdwallet structures for development, and working with Ledger and Trezor hdwallets.

The following is a loose collection of ideas that lead to the creation of this library / a small TODO section of things that would be nice to have

## overall idea for HDWallet in Ethereum

* have a signer and a watcher device (signer is offline, watcher is online)
  -> watcher has UI to create transactions (send ETH, call functions on smart contracts)
  -> user interacts with UI, creates a transctions (gas estimate made, dry run is successful) and a QR code is displayed
  -> signer scans QR codes from watcher
  -> signer signs tx and displays a QR code
  -> watcher scans QR code and can broadcast to internet
  -> watcher receives update when the transctions has been successful
  -> watcher has other filters and receives notifications

* Ethereum is "account-based" however it is not a good idea to keep all ETH and tokens in one
  place
  -> being able to have a small wallet on your mobile is nice
  -> splitting up ETH / tokens to many addresses keeps you "safer" unless you prefer MultiSig / Vault contract that holds everything
  -> businesses can generate additional addresses with their private keys for spending
  -> have one root mnemonic / extended private key to recover (mobile device gets lost / main laptop is stolen)
  -> responsibility stays with end user who needs to have a recovery plan for root seed (compared to Identity smart contract that will have some kind of `heir` address or another recovery mode that relies on other addresses to select the next owner address)

* with Identity contracts, many addresses can be added, but you still need to add each address
  -> must also sign transactions to Identity contract for permission changes
  -> can have privacy issues here as how to allow many addresses permission without exposing them all
  -> is the "passive" vs "active" management of ETH and tokens
  * Identity contract allows for one location of all ETH and tokens
  * HDWallet setup requires active management, since addresses

## given an extended public key

(assuming given an `account` level key)

### (offline mode)

* derive paths and tag accounts / address indexes (ie. `account` is "engineering org", `address_index` is "hosting costs for 2018")
* display the ETH addresses (and if storing data, whatever is available about balances)

### (online mode)

* explore `addresses_index` until a gap of 20 has been reached that are unused
* display the ETH addresses, link to etherscan, show total ETH balance and transaction count
* all offline mode features

## given an extended private key OR mnemonic

(assuming given hdwallet root key)

### (offline mode)

* all offline mode features for public key cases
* sign transactions
* store / export derived account extended public keys for online usage in "public mode"

### (online mode)

* probably just warn that they are online.. signing should only be allowed in an offline state

## tech needed

* be able to detect online or offline
* some kind of local storage, to store `account` path extended public keys for ease of use
* some kind of export schema for `account` path extended public keys for ease of use

## future thoughts

* if this is used for an organization, likely they will want an easy way to export for audit purposes
  * this could be a feature that the year is part of the path
  * this could be determined based on transactions sent / received with a timestamp filter
* a trusted server could hold the extended public keys, to provide on-demand reporting
  * this could be tied to an event watcher that sends notifications when a transaction includes one of the ethereum addresses

## TODO

### discover accounts

* search for used addresses (20 indexes is the gap limit)
