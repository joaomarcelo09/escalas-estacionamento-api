import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
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
