import { type TCard } from "./card";

export type TPlayer = {
  id: string;
  name: string;
  roomId: string;
  isReady: boolean;
  cards: TCard[];
};
