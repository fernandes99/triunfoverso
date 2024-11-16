import { IPlayer } from './player';

export interface ITurn {
  currentPlayer: IPlayer;
  roomId: string;
  round: number;
  history: string[];
  state: 'initial' | 'in-dispute' | 'finished';
}
