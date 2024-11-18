import { deckService } from '@/services/decks';

export async function GET() {
  try {
    const responseData = await deckService.getAll();
    return Response.json(responseData);
  } catch (error) {
    return new Response(`Error on get cards: ${error}`, {
      status: 500
    });
  }
}
