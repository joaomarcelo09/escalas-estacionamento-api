import { Test, TestingModule } from '@nestjs/testing';
import { GroupScaleController } from './group-scale.controller';
import { GroupScaleService } from './group-scale.service';

describe('GroupScaleController', () => {
  let controller: GroupScaleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupScaleController],
      providers: [GroupScaleService],
    }).compile();

    controller = module.get<GroupScaleController>(GroupScaleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
