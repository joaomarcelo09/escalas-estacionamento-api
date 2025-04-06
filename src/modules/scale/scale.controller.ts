import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ScaleService } from './scale.service';
import { CreateScaleDto } from './dto/create-scale.dto';
import { GroupScaleService } from './group-scale.service';
import { SectorService } from '../sector/sector.service';
// import { PrismaClient } from '@prisma/client';
// import { timeout } from 'rxjs';

// const $prisma = new PrismaClient();

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

    await Promise.all(
      dataFormatted.map(async (scale) => {
        await this.scaleService.create(scale);

        await Promise.all(
          scale.sectors.map(async (sector) => {
            const scaleSectorId = await this.scaleService.createScaleSector(
              sector,
              scale.id,
            );

            // Garante que essa operação seja concluída antes da transação ser fechada
            await this.scaleService.createCoopSectorScale(
              sector.cooperators,
              scaleSectorId,
            );
          }),
        );
      }),
    );
    // await $prisma.$transaction(
    //   async (tx) => {
    //   },
    //   { timeout: 100000 },
    // );

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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateScaleDto: UpdateScaleDto) {
  //   return this.scaleService.update(+id, updateScaleDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scaleService.remove(+id);
  }
}
