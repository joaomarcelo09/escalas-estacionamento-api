import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SectorService } from './sector.service';

@Controller('sector')
export class SectorController {
  constructor(private service: SectorService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll() {
    return this.service.findAll();
  }
}
