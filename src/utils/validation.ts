import { KeyboardEvent } from 'react';
import * as Yup from 'yup';

// true: if password in username
export const passwordInUsername = (
  username: string,
  password: string
): boolean => {
  const usernameLetters = username
    .split('')
    .filter((char) => /[a-zA-Z]/.test(char))
    .join('')
    .toLocaleLowerCase();
  const passwordLetters = password
    .split('')
    .filter((char) => /[a-zA-Z]/.test(char))
    .join('')
    .toLocaleLowerCase();

  return username.length > passwordLetters.length
    ? usernameLetters.includes(passwordLetters)
    : passwordLetters.includes(usernameLetters);
};

export const stringCompare = (string1: string, string2: string): boolean => {
  return string1.toLowerCase() === string2.toLowerCase();
};

export const handleNumberInvalidKey = (e: KeyboardEvent<HTMLInputElement>) => {
  const invalidChars = ['e', 'E', '+', '-', '.'];
  return invalidChars.includes(e.key) && e.preventDefault();
};

export const getCount = (data: any, level: number) => {
  let count = 0;
  for (const k in data) {
    if (typeof data[k] === 'object') {
      count += getCount(data[k], level + 1);
    } else {
      count += 1;
    }
  }
  return count;
};
