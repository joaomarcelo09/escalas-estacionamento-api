import { CreateCooperatorsScaleDto } from '../dto/create-cooperators.scale.dto';
import { ScaleDto } from '../dto/scale.dto';
import { SectorDto } from '../dto/sector.dto';

export const checkDepartament = ({
  scale,
  cooperators = [],
  sector,
  days,
  departament,
}: {
  cooperators: CreateCooperatorsScaleDto[];
  scale: ScaleDto;
  sector: SectorDto;
  days;
  departament;
}) => {
  if (departament == '' || departament == null) return [];
  const sundays = [];

  days.forEach((day) => {
    if (day.dayOfWeek == 'sunday') {
      sundays.push(day);
    }
  });
  const last_day = sundays.pop();

  return [];
};
