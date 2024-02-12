import { CARDS_TEST } from '@/constants/cards';

export interface IUser {
    id: string;
    name: string;
    roomId: string;
    cards: typeof CARDS_TEST;
    isReady: boolean;
}
