import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rubric } from '../entities/rubric.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RubricDto } from '../dto/rubric-dto';

@Injectable()
export class RubricService {
  constructor(
    @InjectRepository(Rubric)
    private rubricRepository: Repository<Rubric>,
  ) {}

  async createRubric(dto: RubricDto.createDto) {
    return this.rubricRepository.save(dto);
  }

  async getRubricById(id: number): Promise<Rubric> {
    const rubric = await this.rubricRepository.findOne({
      where: { rubricId: id },
    });

    if (!rubric) {
      throw new NotFoundException('Rubric not found');
    }
    return rubric;
  }

  async updateRubric(dto: RubricDto.updateDto) {
    const { rubricId } = dto;
    const exists = await this.rubricRepository.existsBy({ rubricId: rubricId });
    if (!exists) {
      throw new NotFoundException('Rubric not found');
    }

    await this.rubricRepository.update(rubricId, dto);
    return { message: '루브릭 업데이트', update: dto };
  }

  async findAll() {
    return await this.rubricRepository.find();
  }

  async findOne(id: number) {
    const rubric = await this.rubricRepository.findOne({
      where: { rubricId: id },
    });

    if (!rubric) {
      throw new BadRequestException({ message: '루브릭을 찾을 수 없습니다.' });
    }

    return rubric;
  }

  async delete(rubricId: number) {
    const exists = await this.rubricRepository.existsBy({ rubricId: rubricId });
    if (!exists) {
      throw new NotFoundException('Rubric not found');
    }
    await this.rubricRepository.delete(rubricId);
    return { message: '루브릭이 성공적으로 제거되었습니다.' };
  }
}
