export const limitString = (word: string) => {
  const limit = 40;
  return word.length > limit ? word.substring(0, limit).concat('...') : word;
};
