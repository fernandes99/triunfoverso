'use client';

import toast from 'react-hot-toast';

import Button from '@/components/Button';
import Select, { TSelectOption } from '@/components/Select';
import { fetchDeckBySlug } from '@/services/deck';
import useCopyToClipboard from '@/utils/hooks/useClipboard';
import { getRandomEmoji } from '@/utils/scripts/emoji';
import storage from '@/utils/scripts/storage';
import { socket } from '@/utils/socket';
import { TDeck } from '@shared/types/deck';
import { TPlayer } from '@shared/types/player';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { LuArrowLeft, LuCopy } from 'react-icons/lu';

const DECK_DEFAULT_OPTIONS = [
  { id: 'series', value: 'series', label: 'Séries' },
  { id: 'animes', value: 'animes', label: 'Animes' },
  { id: 'games', value: 'games', label: 'Jogos' }
] as TSelectOption[];

interface WelcomeContentProps {
  roomId: string;
}

export default function RoomContent({ roomId }: Readonly<WelcomeContentProps>) {
  const router = useRouter();
  const [deckOptions, setDeckOptions] = useState(DECK_DEFAULT_OPTIONS);
  const [deckOptionSelected, setDeckOptionSelected] = useState<TSelectOption>(
    DECK_DEFAULT_OPTIONS[0]
  );
  const [connectedPlayers, setConnectedPlayers] = useState<TPlayer[]>([]);
  const [deck, setDeck] = useState<Nullable<TDeck>>(null);
  const [isReady, setIsReady] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard('', 3000);

  const goToHome = () => {
    socket.disconnect();
    router.push('/');
  };

  const copyRoomId = () => {
    copyToClipboard(roomId);
    toast.success('Código copiado');
  };

  const handleReadyPlayer = () => {
    if (connectedPlayers?.length < 2 && !isReady) {
      toast('É necessário 2 jogadores ou mais para iniciar', {
        icon: getRandomEmoji()
      });
    }

    socket.emit('cl_player:on-ready', { roomId, isReady: !isReady });
    setIsReady((prev) => !prev);
  };

  const handleSelectDeckOption = async (option: TSelectOption) => {
    setDeckOptionSelected(option);

    try {
      const deckSelected = await fetchDeckBySlug(option.value);

      if (!deckSelected) {
        throw new Error('Deck não encontrado');
      }

      return setDeck(deckSelected);
    } catch (e) {
      return toast.error(`${getRandomEmoji()} Que pena, não foi possível buscar o deck`);
    }
  };

  useMemo(() => {
    if (deck) {
      socket.emit('cl_game:add-deck', {
        roomId,
        deck
      });
    }
  }, [deck]);

  useEffect(() => {
    if (connectedPlayers.length > 1 && connectedPlayers.every((player) => player.isReady)) {
      router.push(`/rooms/${roomId}/in-game`);
    }
  }, [connectedPlayers, router, roomId]);

  useEffect(() => {
    handleSelectDeckOption(deckOptionSelected);
  }, [deckOptionSelected]);

  useEffect(() => {
    const onConnected = () => console.log('Connected');
    const onDisconnected = () => console.log('Disconnected');
    const onUpdatePlayer = setConnectedPlayers;
    const onUpdateDeck = (deck: TDeck) => {
      setDeck(deck);
      setDeckOptionSelected(deckOptions.find((d) => d.id === deck.slug)!);
    };

    socket.on('connect', onConnected);
    socket.on('disconnect', onDisconnected);
    socket.on('sv_players:update', onUpdatePlayer);
    socket.on('sv_deck:update', onUpdateDeck);

    socket.emit('cl_room:connect', {
      roomId,
      playerName: storage.get('player-name') || `Anônimo${(Math.random() * 1000).toFixed(0)}`
    });

    return () => {
      socket.off('connect', onConnected);
      socket.off('disconnect', onDisconnected);
      socket.off('sv_players:update', onUpdatePlayer);
    };
  }, [roomId]);

  return (
    <div className='container mx-auto flex h-screen items-center justify-center'>
      <div className='flex flex-col rounded-xl bg-white p-12'>
        <button
          type='button'
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
            <Select
              label='Deck'
              value={deckOptionSelected}
              options={deckOptions}
              onChange={setDeckOptionSelected}
              className='w-32'
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
              <span className='mr-1 text-sm font-semibold text-neutral-900'>{roomId}</span>
              <LuCopy className='text-neutral-400' />
            </div>
          </div>
          <ul className='flex flex-col gap-2 rounded-lg border border-neutral-300 p-3 pl-4'>
            {connectedPlayers.map((player) => (
              <li className='flex items-center justify-between gap-2' key={player.id}>
                <span>{player.name}</span>
                {player.isReady ? (
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
            onClick={handleReadyPlayer}
          >
            {isReady ? 'Cancelar' : 'Pronto'}
          </Button>
        </div>
      </div>
    </div>
  );
}
