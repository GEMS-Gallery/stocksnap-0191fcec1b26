import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Holding {
  'currentPrice' : number,
  'purchasePrice' : number,
  'name' : string,
  'sector' : string,
  'quantity' : number,
  'assetType' : string,
  'symbol' : string,
}
export interface Transaction {
  'fee' : number,
  'currentPrice' : number,
  'shares' : number,
  'transactionType' : string,
  'date' : bigint,
  'name' : string,
  'sector' : string,
  'assetType' : string,
  'price' : number,
  'symbol' : string,
}
export interface _SERVICE {
  'addTransaction' : ActorMethod<
    [
      string,
      string,
      string,
      string,
      number,
      number,
      number,
      number,
      string,
      string,
    ],
    undefined
  >,
  'getAllocations' : ActorMethod<
    [],
    {
      'cash' : number,
      'crypto' : number,
      'fixedIncome' : number,
      'equity' : number,
    }
  >,
  'getHoldings' : ActorMethod<[], Array<Holding>>,
  'getTransactions' : ActorMethod<[], Array<Transaction>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
