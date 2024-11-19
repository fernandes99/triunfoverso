import { deckService } from '@/services/deck';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const responseData = await deckService.getBySlug(slug);
    return Response.json(responseData);
  } catch (error) {
    return new Response(`Error on get deck: ${error}`, {
      status: 500
    });
  }
}
