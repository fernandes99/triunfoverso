import { TPlayer } from './player';

export interface ITurn {
  currentPlayer: TPlayer;
  roomId: string;
  round: number;
  history: string[];
  state: 'initial' | 'in-dispute' | 'finished';
}
