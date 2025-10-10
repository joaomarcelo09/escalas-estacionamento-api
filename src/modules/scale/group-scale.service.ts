import { BadRequestException, Injectable } from '@nestjs/common';
import { filterCooperators, getWednesdaysAndSundaysInMonth } from './utils';
import { CreateScaleDto } from './dto/create-scale.dto';
import { chooseCooperators } from './utils/chooseCooperators';
import { ResponseScaleDto } from './dto/response-scale.dto';
import { ResponseSectorDto } from './dto/response-sector.dto';
import { SectorDto } from './dto/sector.dto';
import { v4 as uuid } from 'uuid';
import { ScaleRepository } from './scale.repository';
import { selectCooperator } from './utils/selectCooperators';
import { checkDepartament } from './utils/checkDepartament';

@Injectable()
export class GroupScaleService {
  constructor(private repository: ScaleRepository) {}
  async generateScale(body: CreateScaleDto, sectors: SectorDto[]) {
    let minimalCooperators = 0;
    const memoryScale: ResponseScaleDto[] = [];
    const memorySector: ResponseSectorDto[] = [];
    const days = getWednesdaysAndSundaysInMonth(body.selected_date);
    const departament = body.departament;

    const createGroupScale = {
      id: uuid(),
      name: 'teste 1',
    };

    const createdGroupScale =
      await this.repository.createGroupScale(createGroupScale);

    sectors.forEach((sector) => {
      minimalCooperators = minimalCooperators + sector.quantity;
    });

    sectors
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      .sort((a) => {
        if (a.type === 'IN') return 1;
        if (a.type === 'OUT') return -1;
      });

    if (body.cooperators.length < minimalCooperators)
      throw new BadRequestException(
        'Não é possível fazer a operação sem a quantidade mínima de cooperadores',
      ); // precisa fazer um handler error

    const scales = days.flatMap((day) =>
      day.dayOfWeek === 'wednesday'
        ? [{ date: day.iso, period: 'night', sectors }]
        : [
            { date: day.iso, period: 'morning', sectors },
            { date: day.iso, period: 'night', sectors },
          ],
    );

    const data = scales.map((scale, index) => {
      const id = uuid();
      const sectors = scale.sectors.map((sec) => {
        let choosedCooperators = [];
        let availableCooperators = [];
        const { arrayCoop: selectedCooperators, left } = selectCooperator({
          cooperators: body.cooperators,
          scale,
          sector: sec,
        });

        const departamentSelected = checkDepartament({
          scale,
          days,
          departament,
          is_departament: sec.is_departament,
        });

        if (
          !selectedCooperators.length ||
          (selectedCooperators.length && left) ||
          !departamentSelected.length
        ) {
          // filtrar cooperadores para que seja escalado no setor atual
          availableCooperators = filterCooperators({
            cooperators: body.cooperators,
            scale,
            scaleId: id,
            sectorId: sec.id,
            memorySector,
            nextDate: scales[index + 1]?.date,
            memoryScale,
          });

          choosedCooperators = chooseCooperators({
            cooperators: availableCooperators,
            sector: sec,
            memoryScale,
            memorySector,
            scaleId: id,
          });
        }

        choosedCooperators = [
          ...selectedCooperators,
          ...departamentSelected,
          ...choosedCooperators,
        ];

        if (!choosedCooperators.length)
          throw new BadRequestException(
            'Não há cooperadores o suficiente para montar uma escala',
          );

        const limitedCooperators = choosedCooperators.slice(0, sec.quantity);

        const bodySector = {
          id_scale: id,
          id_sector: sec.id,
          type: sec.type,
          name: sec.name,
          cooperators: limitedCooperators.map((coop) => ({
            id_coop: coop.id_coop,
            name: coop.coop_name,
            type: coop.type,
          })),
        };

        memorySector.push(bodySector);

        return bodySector;
      });

      const bodyScale = {
        id,
        id_group_scale: createdGroupScale.id,
        period: scale.period,
        date: scale.date,
        sectors,
      };

      memoryScale.push(bodyScale);

      return bodyScale;
    });

    return data;
  }
}
