import InGameContent from './content';

type TParams = Promise<{ id: string }>;
interface InGamePageProps {
  params: TParams;
}

export default async function InGamePage({ params }: Readonly<InGamePageProps>) {
  const { id } = await params;

  return (
    <main className='max-w-[2560px]'>
      <InGameContent roomId={id} />
    </main>
  );
}
