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

    return this.findOne(id, coopDB.id_app_type);
  }

  async updatePinnedException(excepDB, excepReq, id_coop) {
    const del = excepDB.filter(
      (x) => !excepReq.some((end) => end == x.id_sector),
    );

    const add = excepReq.filter(
      (x) => !excepDB.some((end) => end.id_sector == x),
    );

    if (add.length) {
      add.map(async (add_excep) => {
        const data = {
          id_cooperator: id_coop,
          id_sector: add_excep,
        };
        await this.repository.createPinnedException(data);
      });
    }

    if (del.length) {
      // delete
      del.map(async (x) => {
        return this.repository.deletePinnedException(x.id);
      });
    }

    return;
  }

  async delete(id: string, user) {
    const coop = await this.findOne(id, user.app_type);

    if (coop.pinned_exceptions.length) {
      coop.pinned_exceptions.map(async (pin_exc) => {
        await this.repository.deletePinnedException(pin_exc.id);
      });
    }

    return this.repository.delete(id);
  }

  async findOne(id: string, id_app_type: string) {
    const where = {
      id,
      id_app_type,
    };
    const include = {
      PinnedException: {
        select: {
          id: true,
          sector: {
            select: {
              id: true,
              name: true,
              type: true,
              mode: true,
            },
          },
        },
      },
    };

    const coop = await this.repository.findOne({ where, include });
    coop.pinned_exceptions = coop.PinnedException;
    delete coop.PinnedException;

    return coop;
  }

  async findAll({ where, include }) {
    const cooperators = await this.repository.findAll({ where, include });
    cooperators.map((coop) => {
      coop.pinned_exceptions = coop.PinnedException;
      delete coop.PinnedException;
    });

    return cooperators;
  }
}
