// @flow
const ethereumUtils = require('./ethereum')

const fixture = (function() {
  // HDWallet derive from mnemonic "friend inner basket option sight swift earth mystery iron black exotic essence"
  // from address is address 0, to is address 1
  return {
    privateKey:
      'ad24da4461d5c6d801c41a5b91444601691c162e84aa7900a5baffb2631d7cda',
    signedTransaction:
      'f86a80834c4b4082520894400bd4cce386f5d682cbb644b6b352d59361f791888ac7230489e80000801ca0478593f213e5744b599cffcf094db73374a52f7fa1cf37702f2a07d5a2fa844fa011d4a9a56e33f0b0bcd987dc3b5af9af2eed89923d0ca224adb36602d90a5fe7',
    signTransactionOptions: {
      gasLimit: 21e3,
      gasPrice: 5e6,
      nonce: 0,
      to: '0x400bd4cce386f5d682cbb644b6b352d59361f791',
      value: 10e18
    }
  }
})()

describe('publicKeyToAddress', () => {
  it('should return the ethereum address from extended public key', () => {
    expect(
      ethereumUtils.publicKeyToAddress(
        new Buffer(
          '02e42ad9c8c534b6840de481a3e526f5d2c7daaf5b1033e294664ead7ffe60a0d0',
          'hex'
        )
      )
    ).toEqual('0x36ba9fd663eed657b3d1a461927c73b189564a6f')
  })
})

describe('signTransaction', () => {
  it('should return the signed transaction hex', () => {
    expect(
      ethereumUtils.signTransaction(
        fixture.privateKey,
        fixture.signTransactionOptions
      )
    ).toEqual(fixture.signedTransaction)
  })
})
