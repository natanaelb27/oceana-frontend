import moment from 'moment';

export const getWantedDatetime = (d: string, condition: string) => {
  if (condition === 'D') {
    return Number(moment(d).format('DD'));
  }

  if (condition === 'H') {
    return Number(moment(d).format('HH'));
  }

  if (condition === 'M') {
    return Number(moment(d).format('mm'));
  }

  if (condition === 'S') {
    return Number(moment(d).format('ss'));
  }
};

export const getDateDiff = (date1: string, date2: string) => {
  return moment(date2).diff(moment(date1));
};
