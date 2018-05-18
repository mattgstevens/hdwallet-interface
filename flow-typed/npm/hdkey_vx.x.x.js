declare module 'hdkey' {
  declare class HDKeyT {
    constructor(versions: { public: string, private: string }): void;
    //
    // static functions
    //
    static fromExtendedKey(extendedKey: string): HDKeyT;
    static fromMasterSeed(seed: Buffer): HDKeyT;
    //
    // instance functions
    //
    derive: (path: string) => HDKeyT;
    deriveChild: (index: number) => HDKeyT;
    privateKey: Buffer;
    privateKey(value: string): void;
    privateExtendedKey: string;
    publicKey: Buffer;
    publicKey(value: string): void;
    publicExtendedKey: string;
    toJSON: () => {
      xpriv: string,
      xpub: string
    };
    //
    // instance properties
    //
    index: number;
    depth: number;
    fingerprint: Buffer;
    identifier: Buffer;
    parentFingerprint: Buffer;
    // TODO: could be useful to show off how this is used to derive the IL and IR in each step of
    // deriveChild
    chainCode: Buffer;
  }

  declare module.exports: typeof HDKeyT
}
