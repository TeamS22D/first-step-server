export class AttendanceInfoDto {
  attendedDays: number;
  totalDays: number;

  constructor(attendedDays: number, totalDays: number)
  {
    this.attendedDays = attendedDays;
    this.totalDays = totalDays;
  }
}
