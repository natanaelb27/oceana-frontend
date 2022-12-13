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

export const toStringTime = (d: string) => moment(d).format('HH:mm A');

export const toCardNumber = (n: string, dashes = true) =>
  dashes ? n.match(/.{1,4}/g)?.join('-') : n.match(/.{1,4}/g)?.join(' ');

export const toPhoneNumber = (n: string) =>
  n.length !== 0 ? `+(62)${n.slice(1)}` : '';
