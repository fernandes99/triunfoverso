'use client';

import { ICard } from '@/types/cards';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface CardProps {
    card: ICard;
}

export const Card = ({ card }: CardProps) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            const { left, top, width, height } = document.body.getBoundingClientRect();

            const x = (clientX - left - width / 2) / (width / 2);
            const y = -(clientY - top - height / 2) / (height / 2);

            setRotation({ x, y });
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <>
            <div className='fixed left-0 top-0 h-screen w-1/2 overflow-hidden'>
                <Image
                    src={card.image_src}
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
                className='w-[380px] overflow-hidden rounded-2xl border-4 border-secondary-900 bg-secondary-900 shadow-lg'
                style={{
                    transform: `rotateX(${rotation.y * 10}deg) rotateY(${rotation.x * 10}deg)`,
                    transformStyle: 'preserve-3d'
                }}
            >
                <div className='grid h-[500px] justify-between'>
                    <div className='relative h-[320px] bg-secondary-500'>
                        <Image
                            src={card.image_src}
                            width={380}
                            height={320}
                            objectFit='fill'
                            quality={100}
                            alt='Dr House'
                            className='h-80 object-cover opacity-75'
                        />
                        <div className='absolute bottom-0 left-0 h-full w-full bg-[linear-gradient(0deg,_rgba(34,29,30,1)_10%,rgba(34,29,30,0)_100%)]' />
                    </div>
                    <ul className='mt-auto grid gap-2 p-4'>
                        {card.attributes.map((attribute) => (
                            <li
                                key={attribute.id}
                                className='group flex cursor-pointer items-center justify-between gap-4 transition-all hover:font-semibold focus:font-semibold'
                                tabIndex={1}
                            >
                                <span className='whitespace-nowrap break-keep text-secondary-200 group-hover:text-primary-500'>
                                    {attribute.name}
                                </span>
                                <div className='h-[1px] w-full border border-dashed border-secondary-700' />
                                <span className='font-bold text-secondary-200 group-hover:text-primary-500 group-focus:text-primary-500'>
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
