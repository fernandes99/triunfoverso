import RoomContent from './content';

interface RoomPageProps {
  params: {
    id: string;
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;

  return (
    <main className='max-w-[2560px]'>
      <RoomContent roomId={id} />
    </main>
  );
}
