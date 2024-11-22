export const gqlCards = `
    id
    title
    slug
    image {
        alt
        url
        width
        height
        blurhash
    }
    logo {
        alt
        url
        width
        height
        blurhash
    }
    attrs {
        id
        value
        attr {
            id
            title
            slug
        }
    }  
`;

export const getQueryAllCards = (filter?: string) => {
  return `
        query QueryAllCards {
            cards: allCardsModels${filter ? `(${filter})` : ''} {
                ${gqlCards}
            }
        }
    `;
};
