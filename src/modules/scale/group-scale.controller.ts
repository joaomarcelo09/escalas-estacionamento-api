import { Controller } from '@nestjs/common';
import { GroupScaleService } from './group-scale.service';

@Controller('group-scale')
export class GroupScaleController {
  constructor(private readonly groupScaleService: GroupScaleService) {}
}
