import { ICard } from './card';

export interface IUser {
    id: string;
    name: string;
    roomId: string;
    isReady: boolean;
    cards: ICard[];
}
