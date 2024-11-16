import InGameContent from './content';

interface InGamePageProps {
  params: {
    id: string;
  };
}

export default async function InGamePage({ params }: InGamePageProps) {
  const { id } = await params;

  return (
    <main className='max-w-[2560px]'>
      <InGameContent roomId={id} />
    </main>
  );
}
