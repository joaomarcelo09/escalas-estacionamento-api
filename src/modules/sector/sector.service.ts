import { Injectable } from '@nestjs/common';
import { SectorRepository } from './sector.repository';

@Injectable()
export class SectorService {
  constructor(private repository: SectorRepository) {}
  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(where, include) {
    return await this.repository.findOne({ where, include });
  }

  async create(data) {
    return await this.repository.create(data);
  }

  async delete(id: string) {
    const where = {
      id,
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
