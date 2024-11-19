import { deckService } from '@/services/deck';

export async function GET() {
  try {
    const responseData = await deckService.getAll();
    return Response.json(responseData);
  } catch (error) {
    return new Response(`Error on get decks: ${error}`, {
      status: 500
    });
  }
}
