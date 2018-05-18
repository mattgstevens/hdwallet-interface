// TODO: fill these types in
declare module 'eth-query' {
  declare class EthQueryT {
    constructor: *;

    getBalance: (*) => void;
    getCode: (*) => void;
    getTransactionCount: (*) => void;
    getStorageAt: (*) => void;
    call: (*) => void;
    protocolVersion: (*) => void;
    syncing: (*) => void;
    coinbase: (*) => void;
    mining: (*) => void;
    hashrate: (*) => void;
    gasPrice: (*) => void;
    accounts: (*) => void;
    blockNumber: (*) => void;
    getBlockTransactionCountByHash: (*) => void;
    getBlockTransactionCountByNumber: (*) => void;
    getUncleCountByBlockHash: (*) => void;
    getUncleCountByBlockNumber: (*) => void;
    sign: (*) => void;
    sendTransaction: (*) => void;
    sendRawTransaction: (
      *,
      cb: (err: typeof Error, transactionHash: string) => void
    ) => void;
    estimateGas: (*) => void;
    getBlockByHash: (*) => void;
    getBlockByNumber: (*) => void;
    getTransactionByHash: (*) => void;
    getTransactionByBlockHashAndIndex: (*) => void;
    getTransactionByBlockNumberAndIndex: (*) => void;
    getTransactionReceipt: (*) => void;
    getUncleByBlockHashAndIndex: (*) => void;
    getUncleByBlockNumberAndIndex: (*) => void;
    getCompilers: (*) => void;
    compileLLL: (*) => void;
    compileSolidity: (*) => void;
    compileSerpent: (*) => void;
    newFilter: (*) => void;
    newBlockFilter: (*) => void;
    newPendingTransactionFilter: (*) => void;
    uninstallFilter: (*) => void;
    getFilterChanges: (*) => void;
    getFilterLogs: (*) => void;
    getLogs: (*) => void;
    getWork: (*) => void;
    submitWork: (*) => void;
    submitHashrate: (*) => void;
  }

  declare module.exports: typeof EthQueryT
}
