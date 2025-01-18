import { Test, TestingModule } from '@nestjs/testing';
import { GroupScaleService } from './group-scale.service';

describe('GroupScaleService', () => {
  let service: GroupScaleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupScaleService],
    }).compile();

    service = module.get<GroupScaleService>(GroupScaleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
