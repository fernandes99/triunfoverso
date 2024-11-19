import { TDeck } from "@shared/types/deck";
import { TPlayer } from "@shared/types/player";
import { TTurn } from "@shared/types/turn";

export type TRoom = {
  players: TPlayer[];
  turn: Nullable<TTurn>;
  deck?: Nullable<TDeck>;
};

export type TRoomId = string;

export type TGlobal = {
  rooms: Record<TRoomId, TRoom>;
};
