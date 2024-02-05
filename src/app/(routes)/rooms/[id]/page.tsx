import RoomContent from './content';

interface RoomPageProps {
    params: {
        id: string;
    };
}

export default function RoomPage({ params }: RoomPageProps) {
    return (
        <main className='max-w-[2560px]'>
            <RoomContent roomId={params.id} />
        </main>
    );
}
