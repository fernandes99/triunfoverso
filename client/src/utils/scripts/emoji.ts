import { EMOJI_LIST } from '@/constants/emojis';

export const getRandomEmoji = () => {
  const randomIndex = Math.floor(Math.random() * EMOJI_LIST.length);
  return EMOJI_LIST[randomIndex];
};
