import moment from 'moment';

export const DATE_FORMAT_NORMAL = 'YYYY-MM-DD';
export const YEAR_FORMAT = 'YYYY';
export const DATE_FORMAT = 'DD.MM';
export const TIME_FORMAT = 'HH:mm';
export const FULL_FORMAT = `${DATE_FORMAT}.${YEAR_FORMAT}`;

export function getNow() {
  if (window.time_machine_date) {
    return moment(window.time_machine_date);
  }

  return moment();
}
