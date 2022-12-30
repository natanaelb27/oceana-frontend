export const roleCodeToText = (code: string) => {
  if (code === '001') {
    return 'Buyer';
  } else if (code === '011') {
    return 'Buyer and Seller';
  } else {
    return 'Admin';
  }
};
