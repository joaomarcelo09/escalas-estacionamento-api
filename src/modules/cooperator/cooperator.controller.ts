import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CooperatorService } from './cooperator.service';
import { CreateCooperatorDto } from './dto/create-cooperator-dto';
import { UpdateCooperatorDto } from './dto/update-cooperator-dto';

@Controller('cooperator')
export class CooperatorController {
  constructor(private service: CooperatorService) {}

  @Post()
  async create(@Body() data: CreateCooperatorDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateCooperatorDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Get()
  async findAll() {
    const where = {};

    return this.service.findAll({ where });
  }
}
