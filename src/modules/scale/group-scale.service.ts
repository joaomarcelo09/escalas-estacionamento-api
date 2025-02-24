import { BadRequestException, Injectable } from '@nestjs/common';
import { filterCooperators, getWednesdaysAndSundaysInMonth } from './utils';
import { CreateScaleDto } from './dto/create-scale.dto';
import { chooseCooperators } from './utils/chooseCooperators';
import { ResponseScaleDto } from './dto/response-scale.dto';
import { ResponseSectorDto } from './dto/response-sector.dto';
import { SectorDto } from './dto/sector.dto';
import { v4 as uuid } from 'uuid';
import { ScaleRepository } from './scale.repository';

@Injectable()
export class GroupScaleService {
  constructor(private repository: ScaleRepository) {}
  async generateScale(body: CreateScaleDto, sectors: SectorDto[]) {
    let minimalCooperators = 0;
    const memoryScale: ResponseScaleDto[] = [];
    const memorySector: ResponseSectorDto[] = [];
    const days = getWednesdaysAndSundaysInMonth(body.selected_date);

    sectors.forEach((sector) => {
      minimalCooperators = minimalCooperators + sector.quantity;
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
        // filtrar cooperadores para que seja escalado no setor atual
        const availableCooperators = filterCooperators({
          cooperators: body.cooperators,
          scale,
          scaleId: id,
          sectorId: sec.id,
          memorySector,
        });

        const choosedCooperators = chooseCooperators({
          cooperators: availableCooperators,
          scale,
          sector: sec,
          memoryScale,
          memorySector,
          index,
        }); // talvez a gente so precise dos ids, ou seja, caso seja possivel, retornar apenas os ids

        const limitedCooperators = choosedCooperators.slice(0, sec.quantity);

        const bodySector = {
          id_scale: id,
          id_sector: sec.id,
          type: sec.type,
          cooperators: limitedCooperators.map((coop) => coop.id_coop),
        };

        memorySector.push(bodySector);

        return bodySector;
      });

      const bodyScale = {
        id,
        id_group_scale: 1,
        period: scale.period,
        date: scale.date,
        sectors,
      };

      memoryScale.push(bodyScale);

      return bodyScale;
    });

    const createGroupScale = {
      id: uuid(),
      name: 'teste 1',
    };

    const createdGroupScale =
      await this.repository.createGroupScale(createGroupScale);

    const responseService = {
      data,
      idGroupScale: createdGroupScale.id,
    };

    return responseService;
  }
}
