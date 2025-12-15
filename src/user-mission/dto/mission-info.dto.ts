export class MissionInfoDto {
  completed: number;
  total: number;
  rate: number;
  remaining: number;

  constructor(completed: number, total: number) {
    this.completed = completed;
    this.total = total;
    this.remaining = Math.max(completed - total, 0)
    this.rate = total === 0 ? 0 : Math.floor((completed / total) * 100);
  }
}
