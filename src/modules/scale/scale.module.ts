import { Module } from '@nestjs/common';
import { ScaleService } from './scale.service';
import { ScaleController } from './scale.controller';
import { GroupScaleService } from './group-scale.service';

@Module({
  controllers: [ScaleController],
  providers: [ScaleService, GroupScaleService],
})
export class ScaleModule {}
