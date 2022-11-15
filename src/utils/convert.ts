export const toCompact = (n: number) => {
  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
  });

  return formatter.format(n);
};

export const toRupiah = (n: number) => `Rp ${n.toLocaleString()}`;
