import { ScaleDto } from '../dto/scale.dto';

export const checkDepartament = ({
  scale,
  days,
  departament,
}: {
  scale: ScaleDto;
  days: Array<{ iso: Date; dayOfWeek: 'sunday' | 'wednesday' }>;
  departament: string;
}) => {
  if (departament == '' || departament == null) return [];
  const sundays = [];

  days.forEach((day) => {
    if (day.dayOfWeek == 'sunday') {
      sundays.push(day);
    }
  });
  const last_day = sundays.pop();

  if (
    scale.date.getTime() == new Date(last_day.iso).getTime() &&
    scale.period === 'night'
  ) {
    return [{ id_coop: null, coop_name: departament }];
  }
  return [];
};
