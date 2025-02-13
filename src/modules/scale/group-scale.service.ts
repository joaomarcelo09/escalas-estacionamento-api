import { BadRequestException, Injectable } from '@nestjs/common';
import { filterCooperators, getWednesdaysAndSundaysInMonth } from './utils';
import { CreateScaleDto } from './dto/create-scale.dto';
import { chooseCooperators } from './utils/chooseCooperators';
import { ResponseScaleDto } from './dto/response-scale.dto';
import { ResponseSectorDto } from './dto/response-sector.dto';
import { SectorDto } from './dto/sector.dto';
import { v4 as uuid } from 'uuid';

const sectors: SectorDto[] = [
  {
    id_sector: 1,
    quantity: 1,
    type: 'out',
  },
  {
    id_sector: 2,
    quantity: 1,
    type: 'in',
  },
  {
    id_sector: 3,
    quantity: 1,
    type: 'in',
  },
  {
    id_sector: 4,
    quantity: 1,
    type: 'in',
  },
  {
    id_sector: 5,
    quantity: 1,
    type: 'in',
  },
  {
    id_sector: 6,
    quantity: 1,
    type: 'in',
  },
  {
    id_sector: 7,
    quantity: 1,
    type: 'out',
  },
];

@Injectable()
export class GroupScaleService {
  async create(body: CreateScaleDto) {
    let minimalCooperators = 0;
    const memoryScale: ResponseScaleDto[] = [];
    const memorySector: ResponseSectorDto[] = [];
    const days = getWednesdaysAndSundaysInMonth(body.selected_date);

    sectors.forEach((sector) => {
      minimalCooperators = minimalCooperators + sector.quantity;
    });

    if (body.cooperators.length < minimalCooperators)
      throw new BadRequestException(
        'Não é possível fazer a operação sem a quantidade mínima de cooperadores',
      ); // precisa fazer um handler error

    const scales = days.flatMap((day) =>
      day.dayOfWeek === 'wednesday'
        ? [{ date: day.iso, period: 'night', sectors }]
        : [
            { date: day.iso, period: 'morning', sectors },
            { date: day.iso, period: 'night', sectors },
          ],
    );

    const data = scales.map((scale, index) => {
      const id = uuid();
      const sectors = scale.sectors.map((sec) => {
        // filtrar cooperadores para que seja escalado no setor atual
        const availableCooperators = filterCooperators({
          cooperators: body.cooperators,
          scale,
          scaleId: id,
          sectorId: sec.id_sector,
          memorySector,
        });

        const choosedCooperators = chooseCooperators({
          cooperators: availableCooperators,
          scale,
          sector: sec,
          memoryScale,
          memorySector,
        }); // talvez a gente so precise dos ids, ou seja, caso seja possivel, retornar apenas os ids

        const limitedCooperators = choosedCooperators.slice(0, sec.quantity);

        const bodySector = {
          id_scale: id,
          id_sector: sec.id_sector,
          type: sec.type,
          cooperators: limitedCooperators.map((coop) => coop.id_coop),
        };

        memorySector.push(bodySector);

        return bodySector;
      });

      const bodyScale = {
        id,
        id_group_scale: 1,
        period: scale.period,
        date: scale.date,
        sectors,
      };

      memoryScale.push(bodyScale);

      return bodyScale;
    });

    return data;
  }
}
