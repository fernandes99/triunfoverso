export interface ICard {
    id: string;
    title: string;
    slug: string;
    attrs: IAttribute[];
    image: {
        blurhash: string;
        url: string;
    };
    logo: {
        url: string;
        width: number;
        height: number;
    };
}

export interface IAttribute {
    value: number;
    attr: {
        slug: string;
        title: string;
    };
}
