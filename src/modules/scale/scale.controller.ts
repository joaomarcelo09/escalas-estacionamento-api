import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ScaleService } from './scale.service';
import { CreateScaleDto } from './dto/create-scale.dto';
import { GroupScaleService } from './group-scale.service';
import { SectorService } from '../sector/sector.service';
import { CooperatorService } from '../cooperator/cooperator.service';
import { User } from '../user/user.decorator';

@Controller('scale')
export class ScaleController {
  constructor(
    private readonly scaleService: ScaleService,
    private readonly groupScaleService: GroupScaleService,
    private readonly sectorService: SectorService,
    private readonly cooperatorsService: CooperatorService,
  ) {}

  @Post()
  async create(@Body() createScaleDto: CreateScaleDto, @User() user) {
    const where = {
      id_app_type: user.app_type,
    };
    const sectors = await this.sectorService.findAll({ where });

    const idCooperatorsBody = createScaleDto.cooperators.map(
      (coop) => coop.id_coop,
    );
    const whereCooperators = {
      id: {
        in: idCooperatorsBody,
      },
    };

    const includeCooperators = {
      PinnedException: true,
    };

    const cooperators = await this.cooperatorsService.findAll({
      where: whereCooperators,
      include: includeCooperators,
    });

    createScaleDto.cooperators = createScaleDto.cooperators.map((coopBody) => {
      const coop = cooperators.find((x) => x.id == coopBody.id_coop);
      return {
        ...coopBody,
        coop_name: coop?.name,
        pinned_exceptions: coop?.pinned_exceptions,
        type: coop?.type,
      };
    });

    const dataFormatted = await this.groupScaleService.generateScale(
      createScaleDto,
      sectors,
    );

    /*    await Promise.all(*/
    /*dataFormatted.map(async (scale) => {*/
    /*await this.scaleService.create(scale);*/

    /*await Promise.all(*/
    /*scale.sectors.map(async (sector) => {*/
    /*const scaleSectorId = await this.scaleService.createScaleSector(*/
    /*sector,*/
    /*scale.id,*/
    /*);*/

    /*// Garante que essa operação seja concluída antes da transação ser fechada*/
    /*await this.scaleService.createCoopSectorScale(*/
    /*sector.cooperators,*/
    /*scaleSectorId,*/
    /*);*/
    /*}),*/
    /*);*/
    /*}),*/
    /*    )*/ // await $prisma.$transaction(
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
