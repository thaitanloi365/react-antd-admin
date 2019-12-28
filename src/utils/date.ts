import moment from 'moment';

export function formatDate(date: string | Date, format = 'YYYY-MM-DD') {
  return moment(date).format(format);
}

export default moment;
