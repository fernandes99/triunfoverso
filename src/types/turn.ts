import { IUser } from './user';

export interface ITurn {
    currentUser: IUser;
    roomId: string;
    round: number;
    title: string;
}
