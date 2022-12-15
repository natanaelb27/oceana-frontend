export const toUrl = (str: string) => {
  let returnStr = '';
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    if (i === splitStr.length - 1) {
      returnStr += splitStr[i];
    } else {
      returnStr += splitStr[i] + '-';
    }
  }
  return returnStr;
};
