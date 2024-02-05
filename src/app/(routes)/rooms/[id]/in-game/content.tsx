'use client';

import { useEffect, useState } from 'react';
import { TbCards } from 'react-icons/tb';
import { GAME } from '@/constants/game';
import { Card } from './components/Card';
import { EmptyCard } from './components/EmptyCard';
import { socket } from '@/utils/socket';
import { IUser } from '@/types/user';
import { ITurn } from '@/types/turn';
import storage from '@/utils/scripts/storage';

interface InGameContentProps {
    roomId: string;
}

export default function InGameContent({ roomId }: InGameContentProps) {
    const [users, setUsers] = useState<IUser[]>([]);
    const [turn, setTurn] = useState<ITurn | null>(null);

    const currentUser = users.find((user) => user.id === socket.id);

    console.log('CurrentUser', currentUser);
    console.log('Users', users);
    console.log('Turn', turn);

    useEffect(() => {
        const onUpdateUser = setUsers;
        const onUpdateTurn = setTurn;

        socket.on('users:update', onUpdateUser);
        socket.on('turn:update', onUpdateTurn);

        socket.emit('game:on-start', { roomId, userName: storage.get('username') });

        return () => {
            socket.off('users:update', onUpdateUser);
            socket.off('turn:update', onUpdateTurn);
        };
    }, [roomId]);

    return (
        <div className='container mx-auto flex h-screen items-center justify-center lg:w-[1200px]'>
            <div className='flex w-full justify-between'>
                {GAME.users.map((user, index) => {
                    const isEnemy = index !== 0;
                    const currentCard = user.cards[isEnemy ? 1 : 0];

                    return (
                        <div key={user.id}>
                            <div
                                className={`flex flex-col ${isEnemy ? 'items-end' : 'items-start'}`}
                            >
                                <span className='text-2xl font-semibold leading-10 text-secondary-200'>
                                    {user.name}
                                </span>
                                <div
                                    className={`mb-4 flex items-center gap-2 font-semibold ${isEnemy ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    <TbCards
                                        className='rounded-full bg-primary-500 p-[3px] text-secondary-700'
                                        size={24}
                                    />
                                    <span className='text-primary-500'>16 cartas</span>
                                </div>
                            </div>

                            {isEnemy ? <EmptyCard /> : <Card card={currentCard} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
