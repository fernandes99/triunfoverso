'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { socket } from '@/utils/socket';
import { getRandomString } from '@/utils/scripts/string';
import storage from '@/utils/scripts/storage';
import Button from '@/components/Button';

export const WelcomeContent = () => {
    const router = useRouter();
    const [creatingRoom, setCreatingRoom] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState(storage.get('username') || '');

    const createRoom = () => {
        const randomString = getRandomString();

        storage.set('username', userName || `Anônimo${Math.random().toFixed(5)}`);
        socket.emit('connect_room', { roomId, userName });
        router.push(`/rooms/${randomString}`);
        setRoomId(randomString);
    };

    const enterRoom = () => {
        if (!roomId) {
            return toast('Insira o código da sala', {
                icon: '🔑'
            });
        }

        storage.set('username', userName || `Anônimo${Math.random().toFixed(5)}`);
        socket.emit('connect_room', { roomId, userName });
        router.push(`/rooms/${roomId}`);
    };

    const handleCreatingRoom = () => {
        setCreatingRoom(!creatingRoom);
    };

    return (
        <div className='container mx-auto flex h-screen items-center justify-center'>
            <div className='flex flex-col items-center justify-center rounded-xl bg-white p-12'>
                <span>Bem vindo ao</span>
                <div className='mb-6 flex'>
                    <span className='text-2xl font-bold'>Triunfo</span>
                    <span className='text-2xl font-bold text-primary-500'>Verso</span>
                </div>
                <div className='flex w-96 flex-col gap-2'>
                    <input
                        placeholder='Seu nome'
                        className='mb-2 w-full rounded-lg border border-neutral-300 px-4 py-3'
                        onChange={(event) => setUserName(event.target.value)}
                        value={userName}
                    />
                    {creatingRoom ? (
                        <>
                            <input
                                placeholder='Digite o código da sala'
                                className='mb-2 w-full rounded-lg border border-neutral-300 px-4 py-3'
                                onChange={(event) => setRoomId(event.target.value)}
                                onKeyDown={(event) => event.key === 'Enter' && enterRoom()}
                            />
                            <Button onClick={enterRoom}>Entrar na sala</Button>
                            <Button onClick={handleCreatingRoom} variant='ghost'>
                                Criar uma sala
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={createRoom}>Criar sala</Button>
                            <Button variant='ghost' onClick={handleCreatingRoom}>
                                Entrar em uma sala
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
