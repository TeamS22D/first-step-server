import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Bizword } from './entities/bizword.entity';
import { CreateBizwordDto } from './dto/create-bizword.dto';
import { UpdateBizwordDto } from './dto/update-bizword.dto';

@Injectable()
export class BizwordsService {
  constructor(
    @InjectRepository(Bizword)
    private readonly bizwordRepository: Repository<Bizword>,
  ) {}

  async onModuleInit() {
    try {
      // 가장 가벼운 쿼리를 날려 강제로 커넥션 풀을 생성합니다.
      await this.bizwordRepository.query('SELECT 1');
    } catch (error) {
      console.error('Database connection failed during module initialization:', error);
    }
  }

  // 용어 생성
  async create(createBizwordDto: CreateBizwordDto): Promise<Bizword> {

    const bizword = this.bizwordRepository.create(createBizwordDto);
    return this.bizwordRepository.save(bizword);
  }

  // 전체 용어 조회
  async findAll(searchTerm?: string): Promise<Bizword[]> {
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      return this.bizwordRepository.find({
        where: [
          { term: Like(`%${lowerCaseSearch}%`) },
          { meaning: Like(`%${lowerCaseSearch}%`) },
        ],
      });
    }
    // 검색어가 없으면 전체 조회
    return this.bizwordRepository.find();
  }

  // 특정 용어 조회 (ID 기준)
  async findOne(id: number): Promise<Bizword> {
    const bizword = await this.bizwordRepository.findOneBy({ id });

    if (!bizword) {
      throw new NotFoundException(`Bizword with ID #${id} not found`);
    }
    return bizword;
  }

  // 용어 수정
  async update(
    id: number,
    updateBizwordDto: UpdateBizwordDto,
  ): Promise<Bizword> {
    const bizword = await this.findOne(id);
    Object.assign(bizword, updateBizwordDto);
    return this.bizwordRepository.save(bizword);
  }

  // 용어 삭제
  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.bizwordRepository.delete(id);
    
    return { message: `Bizword with ID #${id} successfully removed` };
  }
}