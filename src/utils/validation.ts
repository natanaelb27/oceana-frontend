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
