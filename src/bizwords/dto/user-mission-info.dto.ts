import { MissionInfoDto } from './mission-info.dto';
import { AttendanceInfoDto } from './attendance-info.dto';

export class UserMissionInfoDto {
  mission: MissionInfoDto;
  attendance: AttendanceInfoDto;

  constructor(mission: MissionInfoDto, attendance: AttendanceInfoDto) {
    this.mission = mission;
    this.attendance = attendance;
  }
}
