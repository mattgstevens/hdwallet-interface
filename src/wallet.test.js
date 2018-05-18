// @flow

const bip39 = require('bip39')
const hdkey = require('hdkey')

const wallet = require('./wallet')

const fixtures = (function() {
  // created with bip39.generateMnemonic()
  const mnemonic =
    'gauge drum menu ask column chimney trim tuition finger treat gossip patrol'

  const privateHDWallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
  const publicHDWallet = hdkey.fromExtendedKey(
    privateHDWallet.publicExtendedKey
  )

  return {
    mnemonic,
    privateHDWallet,
    publicHDWallet,
    keys: {
      publicKey:
        '02e42ad9c8c534b6840de481a3e526f5d2c7daaf5b1033e294664ead7ffe60a0d0',
      privateKey:
        'd3b538c0900cc4ab2bc5f9926cdcc868b35163a5e67fef6842521eed997ccb3c'
    },
    validExtendedKeys: {
      public:
        'xpub661MyMwAqRbcFHqkdj9HMotbB64hBV9r9v5MP1A3pSDXQncmJY9QwnhoJz97gAnoD1su9E5EkQZ279kbFyyQMXpMaXzKUsZ2r2JwXKzE7mQ',
      private:
        'xprv9s21ZrQH143K2omHXhcGzfwrd4ECn2Rznh9kackSG6gYXzHckzqAPzPKTiz6oGazqnq8V5BAC6TesTPe36UsXzQ3PQcfXdC7F5LZ7HccQsJ'
    },
    invalidExtendedKeys: {
      // there are many failures to account for; likely cause is copy paste fail, so we wont
      // exhaustively explore those failure paths in this test suite
      checksum: 'xpub123'
    },
    // TODO: validate that transactions work on a testnet with this info
    ethereum: {
      privateKey:
        'd3b538c0900cc4ab2bc5f9926cdcc868b35163a5e67fef6842521eed997ccb3c',
      publicKey: '0x36ba9fd663eed657b3d1a461927c73b189564a6f'
    }
  }
})()

describe('fromMnemonic', () => {
  describe('when given a valid mnemonic', () => {
    it('should work', () => {
      expect(wallet.fromMnemonic(fixtures.mnemonic)).toBeInstanceOf(hdkey)
    })
  })

  describe('when given an invalid mnemonic', () => {
    it('should error', () => {
      expect(() => wallet.fromMnemonic('this is gonna go boom')).toThrow(
        'wallet.from-mnemonic.error.mnemonic-not-valid'
      )
    })
  })
})

describe('fromExtendedKey', () => {
  describe('when given a valid private extended key', () => {
    it('should work', () => {
      expect(
        wallet.fromExtendedKey(fixtures.validExtendedKeys.private)
      ).toBeInstanceOf(hdkey)
    })
  })

  describe('when given a valid public extended key', () => {
    it('should work', () => {
      expect(
        wallet.fromExtendedKey(fixtures.validExtendedKeys.public)
      ).toBeInstanceOf(hdkey)
    })
  })

  describe('when given an invalid extended key', () => {
    it('should error', () => {
      expect(() =>
        wallet.fromExtendedKey(fixtures.invalidExtendedKeys.checksum)
      ).toThrow('wallet.from-extended-key.error.extended-key-not-valid')
    })
  })
})

describe('getIndex', () => {
  describe('when given a hdwallet initialized with a private key', () => {
    it('should return a deterministic hdkey based on the index', () => {
      expect(wallet.getIndex(fixtures.privateHDWallet, 0)).toEqual(
        fixtures.privateHDWallet.deriveChild(0)
      )
    })
  })

  describe('when given a hdwallet initialized with a public key', () => {
    it('should return a deterministic hdkey for only xpub based on the index', () => {
      const derivedIndex = wallet.getIndex(fixtures.publicHDWallet, 0).toJSON()
      expect(derivedIndex.xpriv).toEqual(null)
      expect(derivedIndex.xpub).toEqual(
        fixtures.privateHDWallet.deriveChild(0).toJSON().xpub
      )
    })
  })
})

describe('getPath', () => {
  describe('when allowing path argument to default', () => {
    describe('when given a hdwallet initialized with a private key', () => {
      it('should return a deterministic hdkey based on the defaultWalletPath', () => {
        expect(wallet.getPath(fixtures.privateHDWallet)).toEqual(
          fixtures.privateHDWallet.derive(wallet.defaultWalletPath)
        )
      })
    })

    describe('when given an hdwallet initialized with a public key', () => {
      it('should error as hardended keys cannot be derived without private key', () => {
        expect(() => wallet.getPath(fixtures.publicHDWallet)).toThrow(
          'wallet.get-path.need-private-key-to-path-with-hardened-keys'
        )
      })
    })
  })

  describe('when providing a path argument', () => {
    describe('when given a hdwallet initialized with a private key', () => {
      it('should return a deterministic hdkey based on the path with hardended and unhardened keys', () => {
        expect(
          wallet.getPath(fixtures.privateHDWallet, "m/44'/128'/0'/0/11")
        ).toEqual(fixtures.privateHDWallet.derive("m/44'/128'/0'/0/11"))
      })
    })

    describe('when given a hdwallet initialized with a public key', () => {
      it('should return a deterministic hdkey based on path without hardended keys', () => {
        expect(wallet.getPath(fixtures.publicHDWallet, 'm/123/4/5/6')).toEqual(
          fixtures.publicHDWallet.derive('m/123/4/5/6')
        )
      })
    })

    it('should not error if the path ends in slash char', () => {
      expect(
        wallet.getPath(fixtures.privateHDWallet, "m/44'/128'/0'/0/11/")
      ).toEqual(fixtures.privateHDWallet.derive("m/44'/128'/0'/0/11"))
    })

    it('should error if the path is not valid', () => {
      expect(() => wallet.getPath(fixtures.privateHDWallet, 'bang!')).toThrow(
        'wallet.get-path.path-not-valid'
      )
    })
  })
})

describe('getPrivateKey', () => {
  describe('when given a hdwallet initialized with a private key', () => {
    it('should work', () => {
      expect(wallet.getPrivateKey(fixtures.privateHDWallet)).toEqual(
        fixtures.ethereum.privateKey
      )
    })
  })

  describe('when given a hdwallet initialized with a public key', () => {
    it('should error', () => {
      expect(() => wallet.getPrivateKey(fixtures.publicHDWallet)).toThrow(
        'wallet.getPrivateKey.no-private-key-given-for-wallet'
      )
    })
  })
})

describe('getPublicAddress', () => {
  describe('when given a hdwallet initialized with a private key', () => {
    it('should work', () => {
      expect(wallet.getPublicAddress(fixtures.privateHDWallet)).toEqual(
        fixtures.ethereum.publicKey
      )
    })
  })

  describe('when given a hdwallet initialized with a public key', () => {
    it('should work', () => {
      expect(wallet.getPublicAddress(fixtures.publicHDWallet)).toEqual(
        fixtures.ethereum.publicKey
      )
    })
  })
})

describe('sanity check', () => {
  test('using getPath and getIndex will result in same hdkey', () => {
    expect(
      wallet.getIndex(wallet.getPath(fixtures.privateHDWallet), 0)
    ).toEqual(
      wallet.getPath(fixtures.privateHDWallet, `${wallet.defaultWalletPath}/0`)
    )
  })

  test('getIndex returns same value whether its a string or number', () => {
    expect(wallet.getIndex(fixtures.privateHDWallet, 0).toJSON()).toEqual(
      // $FlowIgnore: passing index as a string to see the effects
      wallet.getIndex(fixtures.privateHDWallet, '0').toJSON()
    )
  })
})
