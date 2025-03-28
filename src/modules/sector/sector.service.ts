import { Injectable } from '@nestjs/common';
import { SectorRepository } from './sector.repository';

@Injectable()
export class SectorService {
  constructor(private repository: SectorRepository) {}
  async findAll() {
    return await this.repository.findAll();
  }
}
