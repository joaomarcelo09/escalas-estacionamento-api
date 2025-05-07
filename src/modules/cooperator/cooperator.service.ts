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
    return this.repository.update(id, coop);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }

  async findAll({ where }) {
    return this.repository.findAll({ where });
  }
}
