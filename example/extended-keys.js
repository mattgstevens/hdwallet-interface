// @flow
const table = require('table').table

const wallet = require('../src/wallet')
const ethereumUtil = require('../src/utils/ethereum')

// helper function to make a pretty log in the terminal for demoing
function writeResult() {
  console.log('HDWallet Details\n---')
  console.log(
    table([
      ['extended public key', hdwallet.publicExtendedKey],
      ['extended public key', hdwallet.privateExtendedKey]
    ])
  )

  try {
    // setup the root account using the default wallet path
    const accountRoot = wallet.getPath(hdwallet, wallet.defaultWalletPath)

    const accountFirstAddress = wallet.getIndex(accountRoot, 0)
    console.log('First address Details\n---')
    console.log(
      table([
        ['public address', wallet.getPublicAddress(accountFirstAddress)],
        ['private address', wallet.getPrivateKey(accountFirstAddress)]
      ])
    )
  } catch (error) {
    console.log('Public extended key used, could not derive to account root')
  }
}

// when given a extended public key, no private keys are made available
//
// // $FlowIgnore: process.env key might be nil, but then we report the error
const hdwallet = wallet.fromExtendedKey(process.env.EXTENDED_KEY)

writeResult()
