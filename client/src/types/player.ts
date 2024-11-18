import { TCard } from './card';

export interface TPlayer {
  id: string;
  name: string;
  roomId: string;
  cards: TCard[];
  isReady: boolean;
}
