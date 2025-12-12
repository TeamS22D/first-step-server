export class MissionInfoDto {
  completed: number;
  total: number;
  remaining: number;
  rate: number;

  constructor(completed: number, total: number) {
    this.completed = completed;
    this.total = total;
    this.remaining = Math.max(total - completed, 0);
    this.rate = total === 0 ? 0 : Math.floor((total / completed) * 100);
  }
}
