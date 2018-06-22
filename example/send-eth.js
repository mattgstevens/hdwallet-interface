// @flow

const table = require('table').table
const treeify = require('treeify').asTree

const wallet = require('../src/wallet')
const ethereumUtil = require('../src/utils/ethereum')

// helper function to make a pretty log in the terminal for demoing
function writeResult(transactionHash) {
  console.log('HDWallet Details\n---')
  console.log(
    table([
      ['extended public key', hdwallet.publicExtendedKey],
      ['extended private key', hdwallet.privateExtendedKey]
    ])
  )
  console.log('Sending from Address Details\n---')
  console.log(
    table([
      ['extended public key', sendingFromAddress.publicExtendedKey],
      ['extended private key', sendingFromAddress.privateExtendedKey]
    ])
  )
  console.log('Transaction Details\n---')
  console.log(
    table(
      [
        [
          'sent from public address',
          wallet.showPublicAddress(sendingFromAddress)
        ],
        ['signed with private key', wallet.showPrivateKey(sendingFromAddress)],
        ['signed transaction data', signedTransaction],
        ['transactionHash', transactionHash]
      ],
      { columns: { '1': { width: 100 } } }
    )
  )
  console.log('Sent Transaction\n---')
  console.log(treeify(transactionOptions, true))
}

// setup the hdwallet using a mnemonic
//
// NOTE: using a mnemonic allows for private keys to be accessed, and should be done on a
// NON-internet connected device (aka cold storage)
//
// $FlowIgnore: process.env key might be nil, but then we report the error
const hdwallet = wallet.fromMnemonic(process.env.HDWALLET_MNEMONIC)

// get the first account
const accountRoot = wallet.getPath(hdwallet, wallet.getPathForAccount(0))

// get the first address index from the account
const sendingFromAddress = wallet.getIndex(accountRoot, 0)

// prepare a transaction
//
// NOTE: this can be done on an internet connected device, to lookup nonce and gas costs automatically
const transactionOptions = {
  gasLimit: 21e3, // just sending eth, expecting default 21.000 gas cost
  gasPrice: 5e6, // what mainnet often is lately; can check at https://ethgasstation.info/
  nonce: parseInt(process.env.NONCE, 10) || 0, // how many transaction this account has sent
  to: wallet.showPublicAddress(wallet.getIndex(accountRoot, 1)), // sending to the second account,
  value: 10e18 // amount to send in wei
}

// sign the transaction
//
// NOTE: this should be done an a NON-internet connected device since privateKey is exposed
const signedTransaction = ethereumUtil.signTransaction(
  wallet.showPrivateKey(sendingFromAddress),
  transactionOptions
)

// send transaction to network
const ethQuery = ethereumUtil.setupEthQuery('http://127.0.0.1:8545')
ethereumUtil
  .sendTransaction(ethQuery, signedTransaction)
  .then(writeResult)
  .catch(error => console.log('ERROR ->   ', error))
