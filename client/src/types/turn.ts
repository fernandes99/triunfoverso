import { IUser } from './user';

export interface ITurn {
    currentUser: IUser;
    roomId: string;
    round: number;
    history: string[];
    state: 'initial' | 'in-dispute' | 'finished';
}
