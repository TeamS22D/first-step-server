import { Test, TestingModule } from '@nestjs/testing';
import { EmailMissionService } from './email-mission.service';

describe('DocumentMissionService', () => {
  let service: EmailMissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailMissionService],
    }).compile();

    service = module.get<EmailMissionService>(EmailMissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
