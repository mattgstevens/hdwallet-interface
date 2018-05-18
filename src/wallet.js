// @flow

const bip39 = require('bip39')
const hdkey = require('hdkey')

const { isMaybeType } = require('./utils/flow')
const { publicKeyToAddress } = require('./utils/ethereum')

import type HDKeyT from 'hdkey'

// ---

// This path follows BIP44 where `'` denotes a hardended derivation
// m / purpose' / coin_type' / account' / change / address_index
//
// https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#Path_levels
//
// Other coin types defined in SLIP44
// https://github.com/satoshilabs/slips/blob/master/slip-0044.md
//
// Hardended keys are only possible when the private key is known for the assumed "root"
//
// NOTE: this is for coin_type Ethereum (`60'`)
// NOTE: in this implementation a call to `getIndex` must be made as it is not included in this
// default path
const defaultWalletPath = "m/44'/60'/0'/0"

type FromMnemonicT = string => HDKeyT
const fromMnemonic: FromMnemonicT = mnemonic => {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw Error('wallet.from-mnemonic.error.mnemonic-not-valid')
  }

  return hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
}

type FromExtendedKeyT = string => HDKeyT
const fromExtendedKey: FromExtendedKeyT = extendedKey => {
  // extendedKey as defined in BIP32
  let hdwallet
  try {
    hdwallet = hdkey.fromExtendedKey(extendedKey)
  } catch (error) {
    // there are many failure along this path: bad checksum, decoding from base58; likely this is
    // a copy paste fail from the user and they should be told to double check
    throw Error('wallet.from-extended-key.error.extended-key-not-valid')
  }

  return hdwallet
}

type GetIndexT = (HDKeyT, number) => HDKeyT
const getIndex: GetIndexT = (hdwallet, index) => hdwallet.deriveChild(index)

type GetPathT = (HDKeyT, ?string) => HDKeyT
const getPath: GetPathT = (hdwallet, path) => {
  if (isMaybeType(path)) path = defaultWalletPath

  if (!hdwallet.privateKey && /'/.test(path)) {
    throw Error('wallet.get-path.need-private-key-to-path-with-hardened-keys')
  }

  // if the path is ending in the slash character, we must remove it or it will error further down
  if (/\/$/.test(path)) {
    path = path.slice(0, -1)
  }

  try {
    // only here until this PR is resolved
    // https://github.com/cryptocoinjs/hdkey/pull/20
    if (!/^m\//.test(path))
      throw Error('this should be fixed soon in hdkey itself')

    return hdwallet.derive(path)
  } catch (error) {
    // the error here can only be a bad path (not starting with "m", incorrect index value)
    throw Error('wallet.get-path.path-not-valid')
  }
}

// NOTE: this implementation is working only for Ethereum currently
type GetPrivateKeyT = HDKeyT => string
const getPrivateKey: GetPrivateKeyT = hdwallet => {
  const privateKey = hdwallet.privateKey
  if (isMaybeType(privateKey))
    throw new Error('wallet.getPrivateKey.no-private-key-given-for-wallet')

  return hdwallet.privateKey.toString('hex')
}

// NOTE: this implementation is working only for Ethereum currently
type GetPublicAddressT = HDKeyT => string
const getPublicAddress: GetPublicAddressT = hdwallet =>
  publicKeyToAddress(hdwallet.publicKey)

module.exports = {
  defaultWalletPath,
  fromMnemonic,
  fromExtendedKey,
  getIndex,
  getPath,
  getPrivateKey,
  getPublicAddress
}
