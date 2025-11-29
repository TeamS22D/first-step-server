import { Test, TestingModule } from '@nestjs/testing';
import { BizwordsController } from './bizwords.controller';
import { BizwordsService } from './bizwords.service';

describe('BizwordsController', () => {
  let controller: BizwordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BizwordsController],
      providers: [BizwordsService],
    }).compile();

    controller = module.get<BizwordsController>(BizwordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
