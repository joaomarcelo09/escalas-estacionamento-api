import {
  eachDayOfInterval,
  lastDayOfMonth,
  getMonth,
  getYear,
  getDay,
  getDaysInMonth,
} from 'date-fns';

export function getWednesdaysAndSundaysInMonth(selectDate: string) {
  const date = new Date();
  const month = getMonth(date);
  const year = getYear(date);

  const days = eachDayOfInterval({
    start: new Date(year, month, 1), // atencao que talvez comece em 0
    end: new Date(year, month, getDaysInMonth(lastDayOfMonth(date))),
  });

  const filteredDays = days.filter((day) => {
    const dayOfWeek = getDay(day);
    if (dayOfWeek === 0 || dayOfWeek === 3) {
      return day;
    }
  });
  return filteredDays;
}
