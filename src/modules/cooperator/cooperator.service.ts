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
      PinnedException: true,
    };

    const pinned_exceptions = coop.pinned_exceptions;
    delete coop.pinned_exceptions;

    const coopDB = await this.repository.findOne({ where, include });

    await this.repository.update(id, coop);

    await this.updatePinnedException(
      coopDB.PinnedException,
      pinned_exceptions,
      id,
    );

    const updatedCoop = await this.repository.findOne({ where, include });

    return updatedCoop;
  }

  async updatePinnedException(excepDB, excepReq, id_coop) {
    const cond = excepDB.filter((x) => !excepReq.some((end) => end.id == x.id));

    if (cond.length > 0) {
      // delete
      cond.map(async (x) => {
        await this.repository.deletePinnedException(x.id);
      });
    }

    for (const it of excepReq) {
      if (it.id && !cond.filter((x) => x.id === it.id).length) {
        const data = {
          id_sector: it.id_sector,
        };
        await this.repository.updatePinnedException(it.id, data);
      }
      if (!it.id) {
        // createPinnedException

        const data = {
          id_sector: it.id_sector,
          id_cooperator: id_coop,
        };

        await this.repository.createPinnedException(data);
      }
    }
    return;
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }

  async findOne(id: string) {
    const where = {
      id,
    };
    const include = {
      PinnedException: {
        select: {
          id: true,
          sector: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    };

    return this.repository.findOne({ where, include });
  }

  async findAll({ where, include }) {
    return this.repository.findAll({ where, include });
  }
}
