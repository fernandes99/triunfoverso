export const EmptyCard = () => {
    return (
        <div className='w-[380px] overflow-hidden rounded-2xl border-4 border-secondary-900 shadow-lg'>
            <div
                className='flex h-[500px] items-center justify-center bg-secondary-900'
                style={{ backgroundImage: 'url("/img/triunfoverso-card.png")' }}
            />
        </div>
    );
};
