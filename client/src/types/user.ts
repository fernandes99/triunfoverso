import { ICard } from './card';

export interface IUser {
    id: string;
    name: string;
    roomId: string;
    cards: ICard[];
    isReady: boolean;
}
