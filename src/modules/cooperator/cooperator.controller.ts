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
import { User } from '../user/user.decorator';

@Controller('cooperator')
export class CooperatorController {
  constructor(private service: CooperatorService) {}

  @Post()
  async create(@Body() data: CreateCooperatorDto, @User() user) {
    const pinned_exceptions = data.pinned_exceptions;
    data.id_app_type = user.app_type;

    delete data.pinned_exceptions;

    let createdCooperator = await this.service.create(data);

    const createdPinnedExcep = await Promise.all(
      pinned_exceptions.map(async (x) => {
        const pinnedExcepData = {
          id_sector: x,
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

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user) {
    return await this.service.findOne(id, user.app_type);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @User() user) {
    return this.service.delete(id, user);
  }

  @Get()
  async findAll(@User() user) {
    const where = {
      id_app_type: user.app_type,
    };
    const include = {
      PinnedException: true,
    };

    return this.service.findAll({ where, include });
  }
}
