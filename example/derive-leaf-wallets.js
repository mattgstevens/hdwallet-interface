// @flow
const bip39 = require('bip39')
const wallet = require('../src/wallet')

// $FlowIgnore: process.env key might be nil, but then we report the error
const orgRootHD = wallet.fromMnemonic(process.env.HDWALLET_MNEMONIC)

//
// Setup
//

const department0 = orgRootHD.derive("m/0'")
const department0Children = [
  department0.deriveChild(0),
  department0.deriveChild(1)
]

const department1 = orgRootHD.derive("m/1'")
const department1Children = [
  department1.deriveChild(0),
  department1.deriveChild(1),
  department1.deriveChild(2)
]

//
// Log results
//

const logMnemonic = (x, i) => {
  console.log('private key', wallet.showPrivateKey(x))
  console.log(`${i} :: ${bip39.entropyToMnemonic(wallet.showPrivateKey(x))}`)
}

console.log('\ndepartment0')
department0Children.forEach(logMnemonic)

console.log('\ndepartment1')
department1Children.forEach(logMnemonic)

console.log('\nso many trees')
