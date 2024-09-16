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
export interface _SERVICE {
  'addHolding' : ActorMethod<
    [string, string, number, number, number, string, string],
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
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
