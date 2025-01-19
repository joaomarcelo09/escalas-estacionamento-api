import { Injectable } from '@nestjs/common';
import {
  filterCooperatorsExceptions,
  filterCooperatorsFrequency,
  getWednesdaysAndSundaysInMonth,
} from './utils';

@Injectable()
export class GroupScaleService {
  create(body) {
    const days = getWednesdaysAndSundaysInMonth(body.selectedDate);

    const sectors = [1, 2, 3, 4, 5, 6];
    const datesOfScale = days.flatMap((x) => [
      { date: x, period: 'morning', sectors },
      { date: x, period: 'night', sectors },
    ]);

    const memoryScale = [];

    const data = datesOfScale.map((scale) => {
      const sectors = scale.sectors.map((sec) => {
        const filterCooperatorsByException = filterCooperatorsExceptions(
          body.cooperators,
          scale,
          sec,
        );

        const filteredCooperators = filterCooperatorsFrequency(
          filterCooperatorsByException,
          scale,
          memoryScale,
        ).map((c) => c.id_coop);

        return { id_sector: sec, cooperators: filteredCooperators };
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
