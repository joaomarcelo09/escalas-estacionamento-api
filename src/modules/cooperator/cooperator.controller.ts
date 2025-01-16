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
import { CooperatorService } from './cooperator.service';
import { CreateCooperatorDto } from './dto/create-cooperator-dto';

@Controller('cooperator')
export class CooperatorController {
  constructor(private service: CooperatorService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() data: CreateCooperatorDto) {
    return this.service.create(data);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll() {
    return this.service.findAll();
  }
}
