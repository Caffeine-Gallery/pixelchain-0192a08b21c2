import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Image {
  'id' : string,
  'url' : string,
  'contentType' : string,
  'owner' : Principal,
  'createdAt' : Time,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Time = bigint;
export interface _SERVICE {
  'getImage' : ActorMethod<[string], [] | [Image]>,
  'getImagesCount' : ActorMethod<[], bigint>,
  'listImages' : ActorMethod<[], Array<Image>>,
  'uploadImage' : ActorMethod<[Uint8Array | number[], string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
