import { Injectable } from '@nestjs/common';
import { filterCooperators, getWednesdaysAndSundaysInMonth } from './utils';

@Injectable()
export class GroupScaleService {
  create(body) {
    const days = getWednesdaysAndSundaysInMonth(body.selectedDate);

    const sectors = [
      {
        id_sector: 1,
        limit: 1,
      },
      {
        id_sector: 2,
        limit: 3,
      },
      {
        id_sector: 3,
        limit: 2,
      },
      {
        id_sector: 4,
        limit: 2,
      },
      {
        id_sector: 5,
        limit: 2,
      },
      {
        id_sector: 6,
        limit: 2,
      },
    ];
    const datesOfScale = days.flatMap((x) => [
      { date: x, period: 'morning', sectors },
      { date: x, period: 'night', sectors },
    ]);

    const memoryScale = [];
    const memorySector = [];

    const data = datesOfScale.map((scale) => {
      const sectors = scale.sectors.map((sec) => {
        const filteredCooperators = filterCooperators(
          body.cooperators,
          scale,
          sec.id_sector,
          memoryScale,
          memorySector,
        );

        filteredCooperators.splice(sec.limit);

        const bodySector = {
          id_sector: sec.id_sector,
          cooperators: filteredCooperators,
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

  findAll() {
    return `This action returns all groupScale`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupScale`;
  }

  update(id: number, updateGroupScaleDto) {
    return `This action updates a #${id} groupScale`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupScale`;
  }
}
