import { Injectable } from '@nestjs/common';
import { CooperatorRepository } from './cooperator.repository';
import { CreateCooperatorDto } from './dto/create-cooperator-dto';

@Injectable()
export class CooperatorService {
  constructor(private repository: CooperatorRepository) {}

  async create(coop: CreateCooperatorDto) {
    return this.repository.create(coop);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }

  async findAll({ where }) {
    return this.repository.findAll({ where });
  }
}
