import { ScaleDto } from '../dto/scale.dto';

export const checkDepartament = ({
  scale,
  days,
  departament,
  is_departament,
}: {
  scale: ScaleDto;
  days: Array<{ iso: Date; dayOfWeek: 'sunday' | 'wednesday' }>;
  departament: string;
  is_departament: boolean;
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
    scale.period === 'night' && is_departament
  ) {
    return [{ id_coop: null, coop_name: departament }];
  }
  return [];
};
