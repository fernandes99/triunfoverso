import { cardService } from '@/services/card';

export async function GET() {
  try {
    const responseData = await cardService.getAll();
    return Response.json(responseData);
  } catch (error) {
    return new Response(`Error on get cards: ${error}`, {
      status: 500
    });
  }
}
