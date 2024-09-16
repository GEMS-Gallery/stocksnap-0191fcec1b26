import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Holding { 'purchasePrice' : number, 'quantity' : number }
export interface _SERVICE {
  'addHolding' : ActorMethod<[string, number, number], undefined>,
  'getHoldings' : ActorMethod<[], Array<[string, Holding]>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
