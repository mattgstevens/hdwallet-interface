// @flow

const EthereumTx = require('ethereumjs-tx')
const EthQuery = require('eth-query')
const secp256k1 = require('secp256k1')
const sha3 = require('js-sha3')
const Web3HttpProvider = require('web3-providers-http')

const wallet = require('../wallet')

import type HDKeyT from 'hdkey'
import type EthQueryT from 'eth-query'

type TransactionOptionsT = {
  data?: string, // encoded data to send
  gasLimit: number, // max gas to use
  gasPrice: number, // price for gas
  nonce: number, // sending addresses next nonce to use
  // TODO: no contract creation at this time
  to: string, // eth address to send to
  value?: number // if sending eth, amount in wei
}

// ---

type PublicKeyToAddressT = Buffer => string
const publicKeyToAddress: PublicKeyToAddressT = publicKey =>
  `0x${sha3
    // we need to "import" first by looking up the publicKey on the curve secp256k1
    // and then hash it using sha3-256
    .keccak_256(secp256k1.publicKeyConvert(publicKey, false).slice(1))
    // an Ethereum address is the lower 160 bits of the hash (but here its already a string, so we
    // slice 40 instead of 20 like the usual hex Buffer)
    .slice(-40)}`

type SetupEthQueryT = string => EthQueryT
/* istanbul ignore next */
const setupEthQuery: SetupEthQueryT = providerUrl => {
  const httpProvider = new Web3HttpProvider(providerUrl)
  // doing this for eth-query interface expectations
  httpProvider.sendAsync = httpProvider.send

  return new EthQuery(httpProvider)
}

type SignTransactionT = (string, TransactionOptionsT) => string
const signTransaction: SignTransactionT = (privateKey, options) => {
  const tx = new EthereumTx()
  tx.data = options.data
  tx.gasLimit = options.gasLimit
  tx.gasPrice = options.gasPrice
  tx.nonce = options.nonce
  tx.to = options.to
  tx.value = options.value
  tx.sign(Buffer.from(privateKey, 'hex'))
  return tx.serialize().toString('hex')
}

type SendTransactionT = (EthQueryT, string) => Promise<*>
/* istanbul ignore next */
const sendTransaction: SendTransactionT = (ethQuery, signedTransaction) =>
  new Promise((resolve, reject) =>
    ethQuery.sendRawTransaction(
      signedTransaction,
      (error, response) => (error ? reject(error) : resolve(response))
    )
  )

module.exports = {
  signTransaction,
  publicKeyToAddress,
  sendTransaction,
  setupEthQuery
}
