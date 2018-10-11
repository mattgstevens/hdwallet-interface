const repl = require('repl')

const { diff, isNil } = require('../src/utils/fn')
const reload = require('./reload-required-module')

/* eslint-disable no-param-reassign */
const initializeContext = context => {
  // reloading of modules during a repl session
  context.reload = moduleName => {
    if (isNil(moduleName)) {
      console.log('reload needs a moduleName to update in require.cache')
      return
    }

    reload(moduleName)
    initializeContext(context)
  }

  context.bip39 = require('bip39')
  context.wallet = require('../src/wallet')

  if (!isNil(process.env.HDWALLET_MNEMONIC)) {
    context.hdwallet = context.wallet.fromMnemonic(
      process.env.HDWALLET_MNEMONIC
    )
  } else if (!isNil(process.env.HDWALLET_EXTENDED_KEY)) {
    context.hdwallet = context.wallet.fromExtendedKey(
      process.env.HDWALLET_EXTENDED_KEY
    )
  }

  if (!isNil(context.hdwallet)) {
    // convenience to spec what accounts and addresses to prepare.
    //
    // format is: { 0: [0,1,2] }
    // where keys are accounts and values are the list of addresses to init with
    const initWith = JSON.parse(
      !isNil(process.env.INIT_WITH) ? process.env.INIT_WITH : '{ "0": [0] }'
    )
    context.accounts = {}

    Object.keys(initWith).forEach(accountIndex => {
      console.log(`loading account ${accountIndex}`)

      const accountRoot = context.wallet.getPath(
        context.hdwallet,
        context.wallet.getPathForAccount(accountIndex)
      )

      console.log('processing accountRoot', accountRoot.publicExtendedKey)

      const addresses = initWith[accountIndex].map(addressIndex => {
        const addressWallet = context.wallet.getIndex(accountRoot, addressIndex)
        const publicAddress = context.wallet.showPublicAddress(addressWallet)

        console.log(
          `loading account ${accountIndex} addressIndex ${addressIndex} -> ethereum address ${publicAddress}`
        )
        return {
          addressIndex,
          publicAddress,
          hdwallet: addressWallet
        }
      })

      context.accounts[accountIndex] = {
        addresses,
        accountIndex,
        hdwallet: accountRoot
      }
    })
  }
}
/* eslint-enable no-param-reassign */

const replServer = repl.start({
  prompt: 'Ξ :: '
})

// load a .env file if present
const startEnv = Object.keys(process.env)
require('dotenv').config()
console.log(
  'what was loaded into env',
  diff(Object.keys(process.env), startEnv)
)

// remind repl user what is available in context
const startContext = Object.keys(replServer.context)
// prepare context for repl
initializeContext(replServer.context)
console.log(
  '\nGreetings! Here is what you have in context:\n',
  diff(Object.keys(replServer.context), startContext)
)
console.log(
  '\nwallet has the following exports:\n',
  Object.keys(replServer.context.wallet)
)

// when .clear is entered into repl
replServer.on('reset', initializeContext)

// when .exit, ctrl-C entered twice for SIGINT, or ctrl-D entered for 'end' input stream
replServer.on('exit', () => console.log('\n\nLong live the blockchains!'))
