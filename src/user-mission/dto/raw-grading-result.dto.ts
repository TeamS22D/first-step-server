export interface RawGradingResult {
  total_score: number;
  grade: string;
  general_feedback: string;
  evaluations: {
    item: string;
    score: number;
    feedback: any;
  }[];
}