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
import { CreateSectorDto } from './dto/create-sector-dto';
import { UpdateSectorDto } from './dto/update-sector-dto';
import { User } from '../user/user.decorator';

@Controller('sector')
export class SectorController {
  constructor(private service: SectorService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@User() user) {
    const where = {
      id_app_type: user.app_type,
    };

    return this.service.findAll({ where });
  }

  @Post()
  async create(@Body() data: CreateSectorDto, @User() user) {
    data.id_app_type = user.app_type;

    return await this.service.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateSectorDto) {
    return await this.service.update(id, data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user) {
    const where = {
      id,
      id_app_type: user.app_type,
    };

    const include = {};

    return await this.service.findOne(where, include);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @User() user) {
    return this.service.delete(id, user.app_type);
  }
}
