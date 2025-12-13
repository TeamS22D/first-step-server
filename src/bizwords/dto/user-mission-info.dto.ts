import { MissionInfoDto } from './mission-info.dto';

export class UserMissionInfoDto {
  document: MissionInfoDto;
  email: MissionInfoDto;
  chat: MissionInfoDto;

  constructor(document: MissionInfoDto, email: MissionInfoDto, chat: MissionInfoDto) {
    this.document = document;
    this.email = email;
    this.chat = chat;
  }
}
