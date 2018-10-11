# hdwallet-interface

A simple interface for hdwallets.

Created with Ethereum keys in mind, however this should be extendable to any cryptocurrency that BIP44 can work with (an idea of that can be found with SLIP44 listing).

## Why use an hdwallet

Using one mnemonic, it is possible to generate keypairs to be used on many blockchains.

Additionally it is deterministic what the next address will be, in the case that someone should be paying a scheduled fee to a new address, or when an API wants to work with a new address per account (and does not want to have the private key as part of the service that is on an internet connected machine).

## Using hdwallet-interface

Working in a REPL is a nice way to get a feel for how to derive nodes in the hdwallet tree.

By running `yarn repl` you will be in a session with the `.env` file processed and some libraries loaded to the context.

### Generate a new hdwallet

When working with a hdwallet, you want a deterministic way of "unlocking" it.

A standard called BIP39 has a known list of words, that is used to create an hdwallet.

```js
// use the bip39 word list with 256 bits of entropy
const mnemonic = bip39.generateMnemonic(256)

// from the mnemonic "unlock" the hdwallet root
const rootHDNode = wallet.fromMnemonic(mnemonic)

console.log(
  'We took the mnemonic\n',
  mnemonic,
  '\nand created an hdwallet\n',
  hdwallet.toJSON()
)
```

The `xpriv` and `xpub` of the hdwallet are "extended public / public keys"; they are called "extended keys" because they are used in the hdwallet to derive nodes "under" them, as well as act as an entry to the hdwallet. They are different than the private and public keys that will be used to sign transactions to be submitted to a blockchain.

```js
// use the private extended key to "unlock" the hdwallet
const xprivRootHDNode = wallet.fromExtendedKey(rootHDNode.privateExtendedKey)
assert.equal(
  xprivRootHDNode.privateExtendedKey,
  rootHDNode.privateExtendedKey,
  'the extended private keys are the same'
)
assert.equal(
  xprivRootHDNode.publicExtendedKey,
  rootHDNode.publicExtendedKey,
  'the extended public keys are the same'
)

// use the public extended key to "unlock" the hdwallet
const xpubRootHDNode = wallet.fromExtendedKey(rootHDNode.publicExtendedKey)
assert.equal(
  xpubRootHDNode.privateExtendedKey,
  '',
  'the extended private key is not available when "unlocking" with the public key'
)
assert.equal(
  xpubRootHDNode.publicExtendedKey,
  rootHDNode.publicExtendedKey,
  'the extended public keys are the same'
)
```

### Derive an account

Now that we have an hdwallet to work with, we can derive paths into the tree structure.

We can build a path for an account, and get back the hdwallet node for it.

```js
const account2Path = wallet.getPathForAccount(2)
const account2HDNode = wallet.getPath(rootHDNode, account2Path)
```

### What is an account good for?

An account is a "hardened" path in BIP44; this means you can derive many accounts and share them to different people, and they will not be able to access other accounts. Someone would need to have the extended private key of the parent node to correctly derive a "hardended" path. To get to many account nodes, the hardened path to the parent would also need to be shared!

By keeping the extended private keys secret at these "hardened" parts of the path, it is safe to share the both the extended private and public parts of the HDNode to trusted people (remember that with the extended private key, they will be able to sign transactions with any address under this account).

### Derive an address

From an account, you can derive address indexes (the leaf nodes of the hdwallet tree structure). These lowest parts of the tree are where public and private keys will be used to sign transactions to be sent to a blockchain.

```js
const account2Address0HDNode = walletaccount2.getIndex(account2HDNode, 0)

console.log('Account 2 Address 0')

// format the public key as an Ethereum address
console.log('ETH address:', wallet.showPublicAddress(account2Addres0HDNode)

// the private key used to sign transactions
console.log('private key:', wallet.showPrivateKey(account2Addres0HDNode)
```

### Whats next?

Run `cp .env.example .env` and change the mnemonic and the config for what accounts / addresses to load.
