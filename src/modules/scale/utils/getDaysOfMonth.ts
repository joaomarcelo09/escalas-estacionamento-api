import {
  eachDayOfInterval,
  lastDayOfMonth,
  getMonth,
  getYear,
  getDay,
  getDaysInMonth,
} from 'date-fns';

const daysOfWeekTable = {
  0: 'sunday',
  3: 'wednesday',
};

export function getWednesdaysAndSundaysInMonth(selectDate: string): {
  iso: Date;
  dayOfWeek: 'sunday' | 'wednesday'; // dps eu vejo isso !
}[] {
  const date = new Date(selectDate);
  const month = getMonth(date);
  const year = getYear(date);
  const filteredDays = [];

  const days = eachDayOfInterval({
    start: new Date(year, month, 1),
    end: new Date(year, month, getDaysInMonth(lastDayOfMonth(date))),
  });

  days.forEach((day) => {
    const dayOfWeek = getDay(day);

    if (dayOfWeek === 0 || dayOfWeek === 3) {
      filteredDays.push({
        iso: day,
        dayOfWeek: daysOfWeekTable[dayOfWeek],
      });
    }
  });

  return filteredDays;
}
