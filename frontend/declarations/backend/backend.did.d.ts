import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Activity {
  'fee' : number,
  'activityType' : string,
  'shares' : number,
  'date' : bigint,
  'account' : string,
  'price' : number,
  'symbol' : string,
}
export interface _SERVICE {
  'addActivity' : ActorMethod<
    [string, string, string, string, number, number, number],
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
  'getBaseCurrency' : ActorMethod<[], string>,
  'importActivities' : ActorMethod<[Array<Activity>], undefined>,
  'setBaseCurrency' : ActorMethod<[string], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
