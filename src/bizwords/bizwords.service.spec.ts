import { Test, TestingModule } from '@nestjs/testing';
import { BizwordsService } from './bizwords.service';

describe('BizwordsService', () => {
  let service: BizwordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BizwordsService],
    }).compile();

    service = module.get<BizwordsService>(BizwordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
