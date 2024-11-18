import { TCard } from './card';

export type TDeck = {
  id: string;
  slug: string;
  title: string;
  cards: TCard[];
};

export type TGetAllResultDecks = {
  data: {
    decks: TCard[];
  };
};
