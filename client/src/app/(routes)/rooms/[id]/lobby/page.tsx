import { Suspense } from 'react';
import RoomContent from './content';

type TParams = Promise<{ id: string }>;

interface RoomPageProps {
  params: TParams;
}

export default async function RoomPage({ params }: Readonly<RoomPageProps>) {
  const { id } = await params;

  return (
    <main className='max-w-[2560px]'>
      <Suspense fallback={<div>Loading...</div>}>
        <RoomContent roomId={id} />
      </Suspense>
    </main>
  );
}
