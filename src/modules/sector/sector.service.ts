import { Injectable } from '@nestjs/common';
import { SectorRepository } from './sector.repository';

@Injectable()
export class SectorService {
  constructor(private repository: SectorRepository) {}
  async findAll({ where }) {
    return await this.repository.findAll({ where });
  }

  async findOne(where, include) {
    return await this.repository.findOne({ where, include });
  }

  async create(data) {
    return await this.repository.create(data);
  }

  async delete(id: string, id_app_type: string) {
    const where = {
      id,
      id_app_type,
    };

    const include = {
      PinnedException: true,
    };

    const sector = await this.findOne(where, include);

    if (sector.PinnedException?.length) {
      await Promise.all(
        sector.PinnedException.map((x) =>
          this.repository.deletePinnedException(x.id),
        ),
      );
    }

    return await this.repository.delete(id);
  }

  async update(id: string, data) {
    return await this.repository.update(id, data);
  }
}
