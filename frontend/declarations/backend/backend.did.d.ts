import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Activity {
  'fee' : number,
  'activityType' : string,
  'date' : bigint,
  'currency' : string,
  'quantity' : number,
  'unitPrice' : number,
  'symbol' : string,
}
export interface _SERVICE {
  'addActivity' : ActorMethod<
    [string, string, number, string, number, string, number],
    undefined
  >,
  'getActivities' : ActorMethod<[], Array<Activity>>,
  'getAllocations' : ActorMethod<
    [],
    {
      'cash' : number,
      'crypto' : number,
      'fixedIncome' : number,
      'equity' : number,
    }
  >,
  'importActivities' : ActorMethod<[Array<Activity>], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
