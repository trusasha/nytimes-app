import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import localeData from 'dayjs/plugin/localeData';
import isTodayPlugin from 'dayjs/plugin/isToday';

dayjs.locale('en-gb');
dayjs.extend(utc);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(localeData);
dayjs.extend(isTodayPlugin);

const globalLocaleData = dayjs.localeData();

export const weekdaysExtraShort = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const firstDayOfWeek = globalLocaleData.firstDayOfWeek();
export const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Get relative post date
 * @param {object} props
 * @param {string} props.date
 * @returns {string} humanize time left
 */
export const datePostFormat = ({ date }) => {
  const diffTime = dayjs(date).diff(dayjs());
  return dayjs.duration(diffTime).humanize(true);
};

/**
 * Calculate array of times in HH:MM format
 * @param {string} startTime
 * @param {string} endTime
 * @param {number} periodInMinutes
 * @returns {string[]}
 */
export const toTimeStringArray = (startTime, endTime, periodInMinutes) => {
  const HOUR_IN_MINUTES = 60;

  const [startHourRaw, startMinuteRaw] = startTime.split(':').map(parseFloat);
  const [endHourRaw, endMinuteRaw] = endTime.split(':').map(parseFloat);

  const startHour = startHourRaw === 24 ? 0 : startHourRaw;
  const endHour = endHourRaw === 0 ? 24 : endHourRaw;

  const startMinute = Math.floor(startMinuteRaw / periodInMinutes) * periodInMinutes;
  const endMinute = Math.ceil(endMinuteRaw / periodInMinutes) * periodInMinutes;

  const isStartTimeGreaterOrSame =
    startHour > endHour || (startHour === endHour && startMinute >= endMinute);

  if (isStartTimeGreaterOrSame) {
    return [
      ...toTimeStringArray(startTime, '00:00', periodInMinutes),
      ...toTimeStringArray(`00:${periodInMinutes}`, endTime, periodInMinutes),
    ];
  } else {
    const periods =
      1 +
      (endHour * HOUR_IN_MINUTES) / periodInMinutes +
      Math.floor(endMinute / periodInMinutes) -
      (startHour * HOUR_IN_MINUTES) / periodInMinutes -
      Math.floor(startMinute / periodInMinutes);

    const offsetInMinutes = startHour * HOUR_IN_MINUTES + startMinute;

    return [...Array(periods)].map((_, index) => {
      const fullMinutes = index * periodInMinutes + offsetInMinutes;
      const hour = Math.floor(fullMinutes / 60) % 24;
      const minute = fullMinutes % 60;
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    });
  }
};

/**
 * Calculate total minutes from time in HH:MM format
 * @param {string} time
 * @returns {number}
 */
export const getMinutesFromTime = (time) =>
  time
    .split(':')
    .map(parseFloat)
    .reduce((acc, value, index) => acc + value * (index === 0 ? 60 : 1), 0);
