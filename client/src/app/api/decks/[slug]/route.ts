import { deckService } from '@/services/decks';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const responseData = await deckService.getBySlug(slug);
    return Response.json(responseData);
  } catch (error) {
    return new Response(`Error on get cards: ${error}`, {
      status: 500
    });
  }
}
