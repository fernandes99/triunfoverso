import { ICard } from './card';

export interface IPlayer {
  id: string;
  name: string;
  roomId: string;
  cards: ICard[];
  isReady: boolean;
}
