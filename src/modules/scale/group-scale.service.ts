import { Injectable } from '@nestjs/common';
import {
  filterCooperatorsToScale,
  getWednesdaysAndSundaysInMonth,
} from './utils';

@Injectable()
export class GroupScaleService {
  create(body) {
    const days = getWednesdaysAndSundaysInMonth(body.selectedDate);

    const sectors = [1, 2, 3, 4, 5, 6];
    const datesOfScale = days
      .flatMap((x) => [
        { date: x, period: 'morning' },
        { date: x, period: 'night' },
      ])
      .flatMap(({ date, period }) =>
        sectors.map((sector) => ({ date, period, sector })),
      );

    const memoryScale = {
      lastCreatedScale: null,
      penultCreatedScale: null,
    };

    const data = datesOfScale.map((x) => {
      const filteredCooperators = filterCooperatorsToScale(
        body.cooperators,
        x,
        memoryScale,
      ).map((c) => c.id_coop);

      const bodyScale = {
        id_group_scale: 1,
        period: x.period,
        date: x.date,
        id_sector: x.sector,
        cooperators: filteredCooperators,
      };

      // Salva as duas ultimas escalas criadas

      const isNewDate = x.sector === 1;

      memoryScale.penultCreatedScale = isNewDate
        ? memoryScale.lastCreatedScale
        : memoryScale.penultCreatedScale;
      memoryScale.lastCreatedScale = isNewDate
        ? bodyScale
        : memoryScale.lastCreatedScale;

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
