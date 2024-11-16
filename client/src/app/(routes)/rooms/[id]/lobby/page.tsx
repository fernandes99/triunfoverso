import RoomContent from './content';

type TParams = Promise<{ id: string }>;

interface RoomPageProps {
  params: TParams;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;

  return (
    <main className='max-w-[2560px]'>
      <RoomContent roomId={id} />
    </main>
  );
}
