import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SectorService } from './sector.service';
import { UpdateCooperatorDto } from '../cooperator/dto/update-cooperator-dto';
import { CreateSectorDto } from './dto/create-sector-dto';
import { UpdateSectorDto } from './dto/update-sector-dto';

@Controller('sector')
export class SectorController {
  constructor(private service: SectorService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() data: CreateSectorDto) {
    return await this.service.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateSectorDto) {
    return await this.service.update(id, data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const where = {
      id,
    };

    const include = {};

    return await this.service.findOne(where, include);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
