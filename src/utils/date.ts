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

export const getDateDiffNow = (endFatetime: string) => {
  return moment(endFatetime).diff(moment(), 'seconds');
};

export const computeDatetime = (seconds: number) => {
  const day = 86400;
  const hour = 3600;
  const minute = 60;

  const daysout = Math.floor(seconds / day);
  const hoursout = Math.floor((seconds - daysout * day) / hour);
  const minutesout = Math.floor(
    (seconds - daysout * day - hoursout * hour) / minute
  );
  const secondsout =
    seconds - daysout * day - hoursout * hour - minutesout * minute;

  return {
    days: daysout,
    hours: hoursout,
    minutes: minutesout,
    seconds: secondsout,
  };
};

export const roundTimeToNearest30 = (date: Date) => {
  const minutes = 30;
  const ms = 1000 * 60 * minutes;

  return new Date(Math.ceil(date.getTime() / ms) * ms);
};
