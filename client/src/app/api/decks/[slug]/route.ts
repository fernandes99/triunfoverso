import { deckService } from '@/services/deck';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const responseData = await deckService.getBySlug(slug);
    return Response.json(responseData);
  } catch (error) {
    console.error(`Error on route api/decks/[slug]: ${error}`);
    return new Response(`Error on route api/decks/[slug]: ${error}`, {
      status: 500
    });
  }
}
