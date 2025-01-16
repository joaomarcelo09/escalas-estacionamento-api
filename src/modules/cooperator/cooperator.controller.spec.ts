import { Test, TestingModule } from '@nestjs/testing';
import { CooperatorController } from './cooperator.controller';

describe('CooperatorController', () => {
  let controller: CooperatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CooperatorController],
    }).compile();

    controller = module.get<CooperatorController>(CooperatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
