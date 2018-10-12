// @flow

const table = require('table').table
const wallet = require('../src/wallet')

// helper function to make a pretty log in the terminal for demoing
function writeResult(hdwallet) {
  console.log('HDWallet Details\n---')
  console.log(
    table([
      ['extended public key', hdwallet.publicExtendedKey],
      ['extended private key', hdwallet.privateExtendedKey],
      ['fingerprint', hdwallet.fingerprint],
      ['parentFingerprint', hdwallet.parentFingerprint],
      ['index', hdwallet.index],
      ['depth', hdwallet.depth]
    ])
  )

  const logAccount = accountWallet => {
    console.log(
      table([
        ['public address', wallet.showPublicAddress(accountWallet)],
        ['private address', wallet.showPrivateKey(accountWallet)],
        ['fingerprint', accountWallet.fingerprint],
        ['parentFingerprint', accountWallet.parentFingerprint],
        ['index', accountWallet.index],
        ['depth', accountWallet.depth]
      ])
    )
  }

  // setup the root account using the default wallet path
  const accountRoot = wallet.getPath(hdwallet, wallet.getPathForAccount(0))

  console.log('First address Details\n---')
  logAccount(wallet.getIndex(accountRoot, 0))

  console.log('Second address Details\n---')
  logAccount(wallet.getIndex(accountRoot, 1))

  console.log('Third address Details\n---')
  logAccount(wallet.getIndex(accountRoot, 2))

  console.log('Fourth address Details\n---')
  logAccount(wallet.getIndex(accountRoot, 3))
}

// $FlowIgnore: process.env key might be nil, but then we report the error
writeResult(wallet.fromMnemonic(process.env.HDWALLET_MNEMONIC))
