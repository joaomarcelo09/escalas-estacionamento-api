import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScaleService } from './scale.service';
import { CreateScaleDto } from './dto/create-scale.dto';
import { UpdateScaleDto } from './dto/update-scale.dto';
import { GroupScaleService } from './group-scale.service';
import { SectorService } from '../sector/sector.service';

@Controller('scale')
export class ScaleController {
  constructor(
    private readonly scaleService: ScaleService,
    private readonly groupScaleService: GroupScaleService,
    private readonly sectorService: SectorService,
  ) {}

  @Post()
  async create(@Body() createScaleDto: CreateScaleDto) {
    const sectors = await this.sectorService.findAll();
    const dataFormatted = await this.groupScaleService.generateScale(
      createScaleDto,
      sectors,
    );

    const createdScale = await this.scaleService.create(dataFormatted);

    return dataFormatted;
  }

  @Get()
  findAll() {
    return this.scaleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scaleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScaleDto: UpdateScaleDto) {
    return this.scaleService.update(+id, updateScaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scaleService.remove(+id);
  }
}
