import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateBizwordDto {
  /**
   * 비즈니스 용어
   * @example "컨센서스"
   */
  @IsString()
  @IsNotEmpty()
  word: string;

  /**
   * 용어에 대한 설명 (문자열 배열)
   * @example ["시장에 대한 전반적인 의견", "시장 기대치"]
   */
  @IsArray()
  @ArrayMinSize(1) // [1] 최소 1개의 설명을 받도록 강제
  @IsString({ each: true }) // [2] 배열의 모든 요소가 문자열인지 확인
  desc: string[];

  /**
   * 용어 사용 예시
   * @example "이번 분기 실적은 컨센서스를 상회했습니다."
   */
  @IsOptional()
  @IsString()
  example: string;
}