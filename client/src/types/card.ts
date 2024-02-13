export interface ICard {
    id: string;
    title: string;
    slug: string;
    attrs: IAttribute[];
    image: {
        blurhash: string;
        url: string;
    };
}

export interface IAttribute {
    value: number;
    attr: {
        slug: string;
        title: string;
    };
}
