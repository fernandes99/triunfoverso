'use client';

import { IAttribute, ICard } from '@/types/card';
import { ITurn } from '@/types/turn';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface CardProps {
    card: ICard;
    turn: ITurn | null;
    onSelectAttribute: (attribute: IAttribute) => void;
}

export const Card = ({ card, turn, onSelectAttribute }: CardProps) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const handleMouseMove = (event: MouseEvent) => {
        if (cardRef.current) {
            const { clientX, clientY } = event;
            const { left, top, width, height } = document.body.getBoundingClientRect();

            const x = (clientX - left - width / 2) / (width / 2);
            const y = -(clientY - top - height / 2) / (height / 2);

            cardRef.current.style.transform = `rotateX(${y * 10}deg) rotateY(${x * 10}deg)`;
        }
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <>
            <div className='fixed left-0 top-0 -z-10 h-screen w-1/2 overflow-hidden'>
                <Image
                    src={card.image.url}
                    blurDataURL={card.image.blurhash}
                    placeholder='blur'
                    width={380}
                    height={320}
                    objectFit='fill'
                    quality={100}
                    alt='Dr House'
                    className='h-full w-full object-cover opacity-10 blur-md grayscale'
                />
                <div className='absolute right-0 top-0 h-full w-1/2 bg-[linear-gradient(270deg,rgba(59,43,47,1)_20%,rgba(59,43,47,0)_100%)]' />
            </div>

            <div
                ref={cardRef}
                className='w-[380px] overflow-hidden rounded-2xl border-4 border-secondary-900 bg-secondary-900 shadow-lg'
                style={{
                    transformStyle: 'preserve-3d'
                }}
            >
                <div className='grid h-[500px] justify-between'>
                    <div className='relative h-[320px] bg-secondary-500'>
                        <Image
                            src={card.image.url}
                            blurDataURL={card.image.blurhash}
                            placeholder='blur'
                            width={380}
                            height={320}
                            objectFit='fill'
                            quality={100}
                            alt={card.title}
                            className='h-80 object-cover opacity-75'
                        />
                        <div className='absolute bottom-0 left-0 h-full w-full bg-[linear-gradient(0deg,_rgba(34,29,30,1)_10%,rgba(34,29,30,0)_100%)]' />
                        <Image
                            src={card.logo.url}
                            width={card.logo.width}
                            height={card.logo.height}
                            quality={100}
                            alt={card.title}
                            className='absolute bottom-0 right-1/2 w-3/5 translate-x-1/2'
                        />
                    </div>

                    <ul className='mt-auto grid gap-2 p-4'>
                        {card?.attrs?.map((attribute) => (
                            <li
                                key={attribute.attr.slug}
                                className={`${turn?.state === 'finished' ? 'cursor-wait' : ''} group flex cursor-pointer items-center justify-between gap-4 transition-all hover:font-semibold focus:font-semibold`}
                                tabIndex={1}
                                onClick={() =>
                                    turn?.state !== 'finished' && onSelectAttribute(attribute)
                                }
                            >
                                <span className='whitespace-nowrap break-keep text-secondary-200 group-hover:text-primary-500'>
                                    {attribute.attr.title}
                                </span>
                                <div className='h-[1px] w-full border border-dashed border-secondary-700' />
                                <span className='font-bold text-secondary-200 group-hover:text-primary-500'>
                                    {attribute.value}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};
