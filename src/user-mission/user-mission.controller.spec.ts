import { Test, TestingModule } from '@nestjs/testing';
import { UserMissionController } from './user-mission.controller';

describe('UserMissionController', () => {
  let controller: UserMissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserMissionController],
    }).compile();

    controller = module.get<UserMissionController>(UserMissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
