import { type TImageGql } from "../../client/src/types/global";

export type TCard = {
  id: string;
  title: string;
  slug: string;
  image: TImageGql;
  logo: TImageGql;
  attrs: TCardAttribute[];
};

export type TCardAttribute = {
  id: string;
  value: number;
  attr: {
    id: string;
    title: string;
    slug: string;
  };
};

export type TGetAllResultCards = {
  data: {
    cards: TCard[];
  };
};
