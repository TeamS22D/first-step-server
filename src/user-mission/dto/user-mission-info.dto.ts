import { MissionInfoDto } from './mission-info.dto';

export class UserMissionInfoDto {
  mission: MissionInfoDto;
  document: MissionInfoDto;
  email: MissionInfoDto;
  chat: MissionInfoDto;

  constructor(
    mission: MissionInfoDto,
    document: MissionInfoDto,
    email: MissionInfoDto,
    chat: MissionInfoDto,
  ) {
    this.mission = mission;
    this.document = document;
    this.email = email;
    this.chat = chat;
  }
}
