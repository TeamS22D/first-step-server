import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rubric } from '../entities/rubric.entity';
import { NotFoundException } from '@nestjs/common';

export class RubricService {
  constructor(
    @InjectRepository(Rubric)
    private rubricRepository: Repository<Rubric>,
  ) {}

  async getRubricById(id: number): Promise<Rubric> {
    const rubric = await this.rubricRepository.findOne({
      where: { rubricId: id },
    });

    if (!rubric) {
      throw new NotFoundException('Rubric not found');
    }
    return rubric;
  }
}
