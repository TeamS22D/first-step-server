export class MissionInfoDto {
  completed: number;
  total: number;
  rate: number;

  constructor(completed: number, total: number) {
    this.completed = completed;
    this.total = total;
    this.rate = total === 0 ? 0 : Math.floor((completed / total) * 100);
  }
}
