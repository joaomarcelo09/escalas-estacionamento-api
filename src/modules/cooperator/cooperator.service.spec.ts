import { Test, TestingModule } from '@nestjs/testing';
import { CooperatorService } from './cooperator.service';

describe('CooperatorService', () => {
  let service: CooperatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CooperatorService],
    }).compile();

    service = module.get<CooperatorService>(CooperatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
