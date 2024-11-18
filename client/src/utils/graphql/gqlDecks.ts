import { gqlCards } from './gqlCards';

const getQueryAllDecks = (filter?: string) => {
  return `
        query QueryAllDecks {
            decks: allDecksModels${filter ? `(${filter})` : ''} {
                id
                slug
                title
                cards {
                    ${gqlCards}
                }
            }
        }
    `;
};

export default getQueryAllDecks;
