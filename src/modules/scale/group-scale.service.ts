import { Injectable } from '@nestjs/common';
import { filterCooperators, getWednesdaysAndSundaysInMonth } from './utils';
import { CreateScaleDto } from './dto/create-scale.dto';
import { chooseCooperators } from './utils/chooseCooperators';
import { ResponseScaleDto } from './dto/response-scale.dto';
import { ResponseSectorDto } from './dto/response-sector.dto';

@Injectable()
export class GroupScaleService {
  async create(body: CreateScaleDto) {
    const sectors = [
      {
        id_sector: 1,
        minimal: 1,
        limit: 1,
      },
      {
        id_sector: 2,
        minimal: 1,
        limit: 3,
      },
      {
        id_sector: 3,
        minimal: 1,
        limit: 2,
      },
      {
        id_sector: 4,
        minimal: 1,
        limit: 2,
      },
      {
        id_sector: 5,
        minimal: 1,
        limit: 2,
      },
      {
        id_sector: 6,
        minimal: 1,
        limit: 2,
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
          alreadyChoosedCooperators: body.alreadySelectedCooperators,
          cooperators: availableCooperators,
          scale,
          sector: sec,
          memoryScale,
          memorySector,
        });

        const limitedCooperators = choosedCooperators.slice(0, limit);

        const bodySector = {
          id_sector: sec.id_sector,
          cooperators: limitedCooperators,
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
