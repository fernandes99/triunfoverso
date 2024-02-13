'use client';

import { useCallback, useEffect, useState } from 'react';
import { TbCards } from 'react-icons/tb';
import { Card } from './components/Card';
import { EmptyCard } from './components/EmptyCard';
import { socket } from '@/utils/socket';
import { IUser } from '@/types/user';
import { ITurn } from '@/types/turn';
import storage from '@/utils/scripts/storage';
import { IAttribute } from '@/types/card';

interface InGameContentProps {
    roomId: string;
}

export default function InGameContent({ roomId }: InGameContentProps) {
    const [users, setUsers] = useState<IUser[]>([]);
    const [turn, setTurn] = useState<ITurn | null>(null);

    const selfUser = users.find((user) => user.id === socket.id);

    const onSelectAttribute = (attribute: IAttribute) => {
        socket.emit('turn:on-select-attribute', { turn, attribute });
    };

    const passTurn = useCallback(() => {
        socket.emit('turn:on-pass', { turn });
    }, [turn]);

    useEffect(() => {
        const onUpdateUser = setUsers;
        const onUpdateTurn = setTurn;
        const onYouWin = () => alert('Parabéns, você ganhou!');
        const onYouLose = () => alert('Vish, tu perdeu irmão!');

        socket.on('users:update', onUpdateUser);
        socket.on('turn:update', onUpdateTurn);
        socket.on('game:you-lose', onYouLose);
        socket.on('game:you-win', onYouWin);

        socket.emit('game:on-start', {
            roomId,
            userName: storage.get('username') || `Anônimo${(Math.random() * 1000).toFixed(0)}`
        });

        return () => {
            socket.off('users:update', onUpdateUser);
            socket.off('turn:update', onUpdateTurn);
            socket.off('game:you-lose', onYouLose);
            socket.off('game:you-win', onYouWin);
        };
    }, [roomId]);

    useEffect(() => {
        if (turn?.state === 'finished' && socket.id === turn.currentUser.id) {
            setTimeout(passTurn, 5000);
        }
    }, [turn, passTurn]);

    console.log('Users', users);
    console.log('Turn', turn);

    return (
        <div className='container mx-auto flex h-screen items-center justify-center lg:w-[1200px]'>
            <div className='relative flex w-full justify-center gap-6'>
                {users.map((user, index) => {
                    const isFirstUser = index === 0;
                    const isSelfUser = user.id === selfUser?.id;
                    const currentCard = user?.cards[0];

                    return (
                        <div key={user.id}>
                            <div
                                className={`flex flex-col ${isFirstUser ? 'items-start' : 'items-end'}`}
                            >
                                <span className='text-2xl font-semibold leading-10 text-secondary-200'>
                                    {user.name}
                                </span>
                                <div
                                    className={`mb-4 flex items-center gap-2 font-semibold ${isFirstUser ? 'flex-row' : 'flex-row-reverse'}`}
                                >
                                    <TbCards
                                        className='rounded-full bg-primary-500 p-[3px] text-secondary-700'
                                        size={24}
                                    />
                                    <span className='text-primary-500'>
                                        {user.cards.length} cartas
                                    </span>
                                </div>
                            </div>

                            {isSelfUser || turn?.state === 'finished' ? (
                                <Card
                                    card={currentCard!}
                                    onSelectAttribute={onSelectAttribute}
                                    turn={turn}
                                />
                            ) : (
                                <EmptyCard />
                            )}
                        </div>
                    );
                })}

                <div className='absolute -top-6 left-1/2 -translate-x-1/2'>
                    <ul className='flex flex-col-reverse items-center justify-center'>
                        {turn?.history.map((action, index) => (
                            <li
                                key={index}
                                className={`${index === 0 ? 'text-lg font-semibold text-secondary-200' : 'font-normal text-secondary-200/50'}
                                    ${index === 2 && 'font-normal text-secondary-200/20'}
                                `}
                            >
                                {action}
                            </li>
                        ))}
                    </ul>
                    {turn?.state === 'finished' && <span>Carregando...</span>}
                </div>

                <div className='absolute -bottom-12 left-1/2 -translate-x-1/2'>
                    <span className='text-sm text-secondary-400'>*Ganha quem zerar o deck</span>
                </div>
            </div>
        </div>
    );
}
