import { GradingResult } from '../entities/grading-result.entity';

export class FeedbackResponseDto {
  evaluations: EvaluationDto[];
  total_score: number;
  grade: string;
  general_feedback: string;

  static fromEntity(result: GradingResult): FeedbackResponseDto {
    return {
      evaluations: result.gradingCriterias.map((c) => ({
        item: c.item,
        score: c.score,
        feedback: {
          good_points: c.feedback.goodPoints,
          improvement_points: c.feedback.improvementPoints,
          suggested_fix: c.feedback.suggestedFix,
        },
      })),
      total_score: result.gradingCriterias.reduce((sum, c) => sum + c.score, 0),
      grade: result.grade,
      general_feedback: result.summeryFeedback,
    };
  }
}

export class EvaluationDto {
  item: string;
  score: number;
  feedback: {
    good_points: string;
    improvement_points: string;
    suggested_fix: string;
  };
}
