import { Injectable } from '@nestjs/common';
import { filterCooperators, getWednesdaysAndSundaysInMonth } from './utils';
import { CreateScaleDto } from './dto/create-scale.dto';
import { chooseCooperators } from './utils/chooseCooperators';
import { ResponseScaleDto } from './dto/response-scale.dto';
import { ResponseSectorDto } from './dto/response-sector.dto';
import { SectorDto } from './dto/sector.dto';

@Injectable()
export class GroupScaleService {
  async create(body: CreateScaleDto) {
    const sectors: SectorDto[] = [
      {
        id_sector: 1,
        minimal: 1,
        limit: 1,
        type: 'out',
      },
      {
        id_sector: 2,
        minimal: 1,
        limit: 3,
        type: 'in',
      },
      {
        id_sector: 3,
        minimal: 1,
        limit: 2,
        type: 'in',
      },
      {
        id_sector: 4,
        minimal: 1,
        limit: 2,
        type: 'in',
      },
      {
        id_sector: 5,
        minimal: 1,
        limit: 2,
        type: 'in',
      },
      {
        id_sector: 6,
        minimal: 1,
        limit: 2,
        type: 'in',
      },
      {
        id_sector: 7,
        minimal: 1,
        limit: 2,
        type: 'out',
      },
    ];
    const days = getWednesdaysAndSundaysInMonth(body.selected_date);
    let minimalCooperators = 0;

    sectors.forEach((sector) => {
      minimalCooperators = minimalCooperators + sector.minimal;
    });

    if (body.cooperators.length < minimalCooperators) return 'oi'; // precisa fazer um handler error

    const datesOfScale = days.flatMap((day) =>
      day.dayOfWeek === 'wednesday'
        ? [{ date: day.iso, period: 'night', sectors }]
        : [
            { date: day.iso, period: 'morning', sectors },
            { date: day.iso, period: 'night', sectors },
          ],
    ); // ver depois se dá pra refatorar isso aq

    const memoryScale: ResponseScaleDto[] = [];
    const memorySector: ResponseSectorDto[] = [];

    const data = datesOfScale.map((scale) => {
      const sectors = scale.sectors.map((sec) => {
        // filtrar cooperadores para que seja escalado no setor atual
        const limit = 2;
        const availableCooperators = filterCooperators({
          cooperators: body.cooperators,
          scale,
          sectorId: sec.id_sector,
          memoryScale,
          memorySector,
        });

        const choosedCooperators = chooseCooperators({
          cooperators: availableCooperators,
          scale,
          sector: sec,
          memoryScale,
          memorySector,
        }); // talvez a gente so precise dos ids, ou seja, caso seja possivel, retornar apenas os ids

        const limitedCooperators = choosedCooperators.slice(0, limit);

        const bodySector = {
          id_sector: sec.id_sector,
          type: sec.type,
          cooperators: limitedCooperators.map((coop) => coop.id_coop),
        };

        memorySector.push(bodySector);

        return bodySector;
      });

      const bodyScale = {
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
