import { IUser } from './user';

export interface ITurn {
    currentUser: IUser;
    roomId: string;
    round: number;
    history: string[];
    result: ITurnResult | null;
    state: 'initial' | 'in-dispute' | 'finished';
}

interface ITurnResult {
    winner: IUser;
    loser: IUser;
}
