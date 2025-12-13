import { Test, TestingModule } from '@nestjs/testing';
import { EmailMissionController } from './email-mission.controller';

describe('DocumentMissionController', () => {
  let controller: EmailMissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailMissionController],
    }).compile();

    controller = module.get<EmailMissionController>(EmailMissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
