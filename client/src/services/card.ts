import { config } from '@/config/general';
import { MOUNTH_IN_SECOND } from '@/constants/timers';
import { getQueryAllCards } from '@/utils/graphql/gqlCards';
import { TGetAllResultCards } from '@shared/types/card';

export const cardService = {
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
          query: getQueryAllCards()
        }),
        next: {
          revalidate: MOUNTH_IN_SECOND
        }
      });
      const result = (await response.json()) as TGetAllResultCards;
      return result.data;
    } catch (error) {
      return new Error(`Error on cardService.getAll: ${error}`);
    }
  }
};
