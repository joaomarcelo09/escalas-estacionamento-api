import { Injectable } from '@nestjs/common';
import { ScaleRepository } from './scale.repository';
import { randomUUID } from 'crypto';
import { ScalePeriod } from '@prisma/client';

@Injectable()
export class ScaleService {
  constructor(private repository: ScaleRepository) {}

  async create(data, tx) {
    const periodValue = data.period.toUpperCase();

    if (!Object.values(ScalePeriod).includes(periodValue as ScalePeriod)) {
      throw new Error(`Invalid period: ${data.period}`);
    }

    await this.repository.create(
      {
        id: data.id,
        period: periodValue as ScalePeriod,
        id_group_scale: data.id_group_scale,
      },
      tx,
    );

    return;
  }

  async createScaleSector(sector, idScale, tx) {
    const scaleSector = await this.repository.createScaleSector(
      {
        id: randomUUID(),
        id_scale: idScale,
        id_sector: sector.id_sector,
      },
      tx,
    );

    return scaleSector.id;
  }

  async createCoopSectorScale(sectorCooperators, idScaleSector, tx) {
    await Promise.all(
      sectorCooperators.map(async (cooperator) => {
        await this.repository.createCoopSectorScale(
          {
            id: randomUUID(),
            id_cooperator: cooperator,
            id_scale_sector: idScaleSector,
          },
          tx,
        );
      }),
    );
  }

  findAll() {
    return `This action returns all scale`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scale`;
  }

  // update(id: number, updateScaleDto: UpdateScaleDto) {
  //   return `This action updates a #${id} scale`;
  // }

  remove(id: number) {
    return `This action removes a #${id} scale`;
  }
}
