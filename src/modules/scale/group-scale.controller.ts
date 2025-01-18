import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GroupScaleService } from './group-scale.service';

@Controller('group-scale')
export class GroupScaleController {
  constructor(private readonly groupScaleService: GroupScaleService) {}

  @Get()
  findAll() {
    return this.groupScaleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupScaleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupScaleDto) {
    return this.groupScaleService.update(+id, updateGroupScaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupScaleService.remove(+id);
  }
}
