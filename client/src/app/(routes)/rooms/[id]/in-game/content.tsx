'use client';

import Loading from '@/components/Loading';
import { IAttribute } from '@/types/card';
import { IPlayer } from '@/types/player';
import { ITurn } from '@/types/turn';
import storage from '@/utils/scripts/storage';
import { socket } from '@/utils/socket';
import { useCallback, useEffect, useState } from 'react';
import { TbCards } from 'react-icons/tb';
import { Card } from './components/Card';
import { EmptyCard } from './components/EmptyCard';

interface InGameContentProps {
  roomId: string;
}

export default function InGameContent({ roomId }: InGameContentProps) {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [turn, setTurn] = useState<ITurn | null>(null);

  const selfPlayer = players.find((player) => player.id === socket.id);
  const isSelfTurn = turn?.currentPlayer.id === selfPlayer?.id;

  const onSelectAttribute = (attribute: IAttribute) => {
    socket.emit('cl_turn:on-select-attribute', { roomId: turn?.roomId, turn, attribute });
  };

  const passTurn = useCallback(() => {
    socket.emit('cl_turn:on-pass', { roomId: turn?.roomId });
  }, [turn]);

  useEffect(() => {
    const onUpdatePlayer = setPlayers;
    const onUpdateTurn = setTurn;
    const onYouWin = () => alert('Parabéns, você ganhou!');
    const onYouLose = () => alert('Vish, tu perdeu irmão!');

    socket.on('sv_players:update', onUpdatePlayer);
    socket.on('sv_turn:update', onUpdateTurn);
    socket.on('game:you-lose', onYouLose);
    socket.on('game:you-win', onYouWin);

    socket.emit('cl_game:on-start', {
      roomId,
      playerName: storage.get('player-name') || `Anônimo${(Math.random() * 1000).toFixed(0)}`
    });

    return () => {
      socket.off('sv_players:update', onUpdatePlayer);
      socket.off('sv_turn:update', onUpdateTurn);
      socket.off('game:you-lose', onYouLose);
      socket.off('game:you-win', onYouWin);
    };
  }, [roomId]);

  useEffect(() => {
    if (turn?.state === 'finished' && socket.id === turn.currentPlayer.id) {
      setTimeout(passTurn, 5000);
    }
  }, [turn, passTurn]);

  console.log('Players', players);
  console.log('Turn', turn);

  return (
    <div className='container mx-auto flex h-screen items-center justify-center lg:w-[1200px]'>
      <div className='relative flex w-full justify-center gap-6'>
        {players.map((player, index) => {
          const isFirstPlayer = index === 0;
          const isSelfPlayer = player.id === selfPlayer?.id;
          const currentCard = player?.cards[0];

          return (
            <div key={player.id}>
              <div className={`flex flex-col ${isFirstPlayer ? 'items-start' : 'items-end'}`}>
                <span className='text-2xl font-semibold leading-10 text-secondary-200'>
                  {player.name}
                </span>
                <div
                  className={`mb-4 flex items-center gap-2 font-semibold ${isFirstPlayer ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <TbCards
                    className='rounded-full bg-primary-500 p-[3px] text-secondary-700'
                    size={24}
                  />
                  <span className='text-primary-500'>{player.cards.length} cartas</span>
                </div>
              </div>

              {isSelfPlayer || turn?.state === 'finished' ? (
                <Card
                  card={currentCard!}
                  onSelectAttribute={onSelectAttribute}
                  turn={turn}
                  disableActions={!isSelfTurn}
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
                className={`${index === 0 ? 'text-lg font-semibold text-secondary-200' : 'font-normal text-secondary-200/50'} ${index === 1 && 'font-normal text-secondary-200/20'} ${index >= 2 && 'font-normal text-secondary-200/10'}`}
              >
                {action}
              </li>
            ))}
          </ul>
        </div>

        <div className='absolute -bottom-12 left-1/2 -translate-x-1/2'>
          <span className='text-sm text-secondary-400'>*Ganha quem zerar o deck</span>
        </div>
      </div>

      {turn?.state === 'finished' && <Loading />}
    </div>
  );
}
