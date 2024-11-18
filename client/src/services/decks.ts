import { config } from '@/config/general';
import { MOUNTH_IN_SECOND } from '@/constants/timers';
import { TGetAllResultDecks } from '@/types/deck';
import getQueryAllDecks from '@/utils/graphql/gqlDecks';

export const deckService = {
  getAll: async () => {
    try {
      const url = config.url.datoGraphQL;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: config.token.datoCms
        },
        body: JSON.stringify({
          query: getQueryAllDecks()
        }),
        next: {
          revalidate: MOUNTH_IN_SECOND
        }
      });
      const result = (await response.json()) as TGetAllResultDecks;
      return result.data;
    } catch (error) {
      return new Error(`Error on cardService.getAll: ${error}`);
    }
  },
  getBySlug: async (slug: string) => {
    try {
      const url = config.url.datoGraphQL;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: config.token.datoCms
        },
        body: JSON.stringify({
          query: getQueryAllDecks(`filter: {slug: {eq: "${slug}"}}`)
        }),
        next: {
          revalidate: MOUNTH_IN_SECOND
        }
      });
      const result = (await response.json()) as TGetAllResultDecks;
      return result.data.decks[0];
    } catch (error) {
      return new Error(`Error on cardService.getAll: ${error}`);
    }
  }
};
