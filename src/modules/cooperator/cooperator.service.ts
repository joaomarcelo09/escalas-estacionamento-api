import { Injectable } from '@nestjs/common';
import { CooperatorRepository } from './cooperator.repository';
import { CreateCooperatorDto } from './dto/create-cooperator-dto';
import { UpdateCooperatorDto } from './dto/update-cooperator-dto';

@Injectable()
export class CooperatorService {
  constructor(private repository: CooperatorRepository) {}

  async create(coop: CreateCooperatorDto) {
    return this.repository.create(coop);
  }

  async createPinnedException(data) {
    return this.repository.createPinnedException(data);
  }

  async update(id: string, coop: UpdateCooperatorDto) {
    const where = {
      id,
    };
    const include = {
      pinnedException: true,
    };

    const coopDB = await this.repository.findOne({ where, include });

    await this.repository.update(id, coop);

    await this.updatePinnedException(
      coopDB.pinned_exceptions,
      coop.pinned_exceptions,
    );

    return;
  }

  async updatePinnedException(excepDB, excepReq) {
    const cond = excepDB.filter((x) => !excepReq.some((end) => end.id == x.id));
    for (const it of excepReq) {
      if (it.id && !cond) {
        const data = {
          id_sector: it.sector,
          reason: it.reason,
          date: it.date,
        };
        await this.repository.updatePinnedException(it.id, data);
      }
      if (!it.id) {
        // createPinnedException

        const data = {
          id_sector: it.sector,
          reason: it.reason,
          date: it.date,
        };

        await this.repository.createPinnedException(data);
      }
      if (cond) {
        // delete
        await this.repository.deletePinnedException(it.id);
      }
    }
    return;
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }

  async findAll({ where, include }) {
    return this.repository.findAll({ where, include });
  }
}
