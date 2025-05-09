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
    const pinned_exceptions = data.pinned_exceptions;

    delete data.pinned_exceptions;

    let createdCooperator = await this.service.create(data);

    const createdPinnedExcep = await Promise.all(
      pinned_exceptions.map(async (x) => {
        const pinnedExcepData = {
          ...x,
          id_cooperator: createdCooperator.id,
        };
        return this.service.createPinnedException(pinnedExcepData);
      }),
    );

    createdCooperator = {
      ...createdCooperator,
      createdPinnedExcep,
    };

    return createdCooperator;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateCooperatorDto) {
    return await this.service.update(id, data);
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
