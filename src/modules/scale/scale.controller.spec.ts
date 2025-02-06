import { Test, TestingModule } from '@nestjs/testing';
import { ScaleController } from './scale.controller';
import { ScaleService } from './scale.service';

describe('ScaleController', () => {
  let controller: ScaleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScaleController],
      providers: [ScaleService],
    }).compile();

    controller = module.get<ScaleController>(ScaleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
