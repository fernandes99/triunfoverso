import InGameContent from './content';

interface InGamePageProps {
    params: {
        id: string;
    };
}

export default function InGamePage({ params }: InGamePageProps) {
    return (
        <main className='max-w-[2560px]'>
            <InGameContent roomId={params.id} />
        </main>
    );
}
