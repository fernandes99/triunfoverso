import { IPlayer } from "./player";

export interface ITurn {
  currentPlayer: IPlayer;
  roomId: string;
  round: number;
  history: string[];
  result: ITurnResult | null;
  state: "initial" | "in-dispute" | "finished";
}

interface ITurnResult {
  winner: IPlayer;
  loser: IPlayer;
}
