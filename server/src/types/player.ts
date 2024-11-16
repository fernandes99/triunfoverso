import { ICard } from "./card";

export interface IPlayer {
  id: string;
  name: string;
  roomId: string;
  isReady: boolean;
  cards: ICard[];
}
