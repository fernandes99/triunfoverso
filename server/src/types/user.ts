import { CARDS } from '../constants/cards';

export interface IUser {
    id: string;
    name: string;
    roomId: string;
    isReady: boolean;
    cards: typeof CARDS;
    graveyard: typeof CARDS;
}
