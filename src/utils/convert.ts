import moment from 'moment';

export const toCompact = (n: number) => {
  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
  });

  return formatter.format(n);
};

export const toRupiah = (n: number) => `Rp ${n.toLocaleString()}`;

export const toStringDate = (d: string) => moment(d).format('DD MMM YYYY');

export const toStringDatetime = (d: string) =>
  moment(d).format('DD MMM YYYY, HH:mm');

export const toLongStringDatetime = (d: string) =>
  moment(d).format('DD MMMM YYYY, HH:mm');
