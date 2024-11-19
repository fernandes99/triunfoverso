import { TPlayer } from "./player";

export type TTurn = {
  currentPlayer: TPlayer;
  roomId: string;
  round: number;
  history: string[];
  result: TTurnResult | null;
  state: "initial" | "in-dispute" | "finished";
};

type TTurnResult = {
  winner: TPlayer;
  loser: TPlayer;
};
