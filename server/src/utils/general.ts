import { ITurn } from "../types/turn";

export const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const updateTurnHistory = (
  value: string,
  currentTurnHistory: ITurn["history"]
) => {
  if (!currentTurnHistory) {
    return [value];
  }

  if (currentTurnHistory.length > 2) {
    currentTurnHistory.pop();
  }

  return [value, ...currentTurnHistory];
};

export const isEmptyObject = (obj: object) => {
  console.log("OBBBBHJJJJJ", obj);
  return !!obj && Object.keys(obj).length === 0;
};
