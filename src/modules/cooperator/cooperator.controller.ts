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
    const assignments = data.assignments;
    console.log(assignments, 'testando');

    delete data.assignments;

    let createdCooperator = await this.service.create(data);

    const createdAssignments = await Promise.all(
      assignments.map(async (x) => {
        const assignData = {
          ...x,
          id_cooperator: createdCooperator.id,
        };
        return this.service.createAssignment(assignData);
      }),
    );
    console.log(createdAssignments, 'createdAssignments');

    createdCooperator = {
      ...createdCooperator,
      createdAssignments,
    };

    return createdCooperator;
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
