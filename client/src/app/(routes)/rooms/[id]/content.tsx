'use client';

import Button from '@/components/Button';
import Select from 'react-select';
import { LuCopy, LuArrowLeft } from 'react-icons/lu';
import { IUser } from '@/types/user';
import useCopyToClipboard from '@/utils/hooks/useClipboard';
import storage from '@/utils/scripts/storage';
import { socket } from '@/utils/socket';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const options = [
    { value: 'series', label: 'Séries' },
    { value: 'animes', label: 'Animes' },
    { value: 'games', label: 'Jogos' }
];

interface WelcomeContentProps {
    roomId: string;
}

export default function RoomContent({ roomId }: WelcomeContentProps) {
    const router = useRouter();
    const [connectedUsers, setConnectedUsers] = useState<IUser[]>([]);
    const [isReady, setIsReady] = useState(false);
    const [, copyToClipboard] = useCopyToClipboard('', 3000);

    const goToHome = () => {
        router.push('/');
    };

    const copyRoomId = () => {
        copyToClipboard(roomId);
        toast.success('Código copiado');
    };

    const handleReadyUser = () => {
        if (connectedUsers?.length < 2 && !isReady) {
            toast('É necessário 2 jogadores ou mais para iniciar', {
                icon: '🥲'
            });
        }

        socket.emit('user:on-ready', { roomId, isReady: !isReady });
        setIsReady((prev) => !prev);
    };

    useMemo(() => {
        if (connectedUsers.length > 1 && connectedUsers.every((user) => user.isReady)) {
            router.push(`/rooms/${roomId}/in-game`);
        }
    }, [connectedUsers, router, roomId]);

    useEffect(() => {
        const onConnected = () => console.log('Connected');
        const onDisconnected = () => console.log('Disconnected');
        const onUpdateUser = setConnectedUsers;

        socket.on('connect', onConnected);
        socket.on('disconnect', onDisconnected);
        socket.on('users:update', onUpdateUser);

        socket.emit('room:connect', {
            roomId,
            userName: storage.get('username') || `Anônimo${(Math.random() * 1000).toFixed(0)}`
        });

        return () => {
            socket.off('connect', onConnected);
            socket.off('disconnect', onDisconnected);
            socket.off('users:update', onUpdateUser);
        };
    }, [roomId]);

    return (
        <div className='container mx-auto flex h-screen items-center justify-center'>
            <div className='flex flex-col rounded-xl bg-white p-12'>
                <button
                    onClick={goToHome}
                    className='-ml-2 -mt-4 mb-1 flex w-fit items-center gap-1 rounded-md px-2 py-1 text-sm text-neutral-500 transition-all hover:bg-neutral-100 hover:text-neutral-700'
                >
                    <LuArrowLeft />
                    <span>voltar</span>
                </button>
                <div className='mb-6 flex items-center justify-between'>
                    <div className='flex'>
                        <span className='text-2xl font-bold'>Triunfo</span>
                        <span className='text-2xl font-bold text-primary-500'>Verso</span>
                    </div>
                    <div className='flex flex-col text-sm'>
                        <span className='z-10 -mb-2 ml-1 w-fit rounded-sm bg-white px-1 text-xs font-medium text-neutral-500'>
                            Tema:
                        </span>
                        <Select
                            value={options[0]}
                            options={options}
                            placeholder='Temas'
                            classNames={{
                                control: () => '!min-h-[32px] !cursor-pointer',
                                valueContainer: () => 'h-[32px]',
                                indicatorsContainer: () => 'h-[32px]'
                            }}
                        />
                    </div>
                </div>
                <div className='flex w-96 flex-col gap-2'>
                    <div className='flex justify-between gap-2'>
                        <p className='text-neutral-900'>Jogadores na sala:</p>
                        <div
                            className='flex cursor-pointer items-center gap-1 rounded-lg border border-dashed border-neutral-300 px-2 py-1 transition-all hover:border-neutral-400 hover:bg-neutral-100'
                            onClick={copyRoomId}
                        >
                            <span className='text-sm font-semibold text-neutral-500'>Código:</span>
                            <span className='mr-1 text-sm font-semibold text-neutral-900'>
                                {roomId}
                            </span>
                            <LuCopy className='text-neutral-400' />
                        </div>
                    </div>
                    <ul className='flex flex-col gap-2 rounded-lg border border-neutral-300 p-3 pl-4'>
                        {connectedUsers.map((user) => (
                            <li className='flex items-center justify-between gap-2' key={user.id}>
                                <span>{user.name}</span>
                                {user.isReady ? (
                                    <span className='rounded-md border border-green-600 px-2 py-1 text-xs font-medium text-green-600'>
                                        Pronto
                                    </span>
                                ) : (
                                    <span className='rounded-md border border-red-600 px-2 py-1 text-xs font-medium text-red-600'>
                                        Não está pronto
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                    <Button
                        className={
                            isReady
                                ? 'border border-neutral-200 bg-transparent text-neutral-400 hover:bg-neutral-200 hover:text-neutral-500'
                                : ''
                        }
                        onClick={handleReadyUser}
                    >
                        {isReady ? 'Cancelar' : 'Pronto'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
