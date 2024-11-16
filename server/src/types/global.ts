import { ITurn } from "./turn";
import { IPlayer } from "./player";

export interface IRoom {
  players: IPlayer[];
  turn: ITurn | null;
}

export type TRoomId = string;

export interface IGlobal {
  rooms: Record<TRoomId, IRoom>;
}
