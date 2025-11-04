import {
  Injectable,
  NotFoundException,
  OnModuleInit, // [1] OnModuleInit 추가
  Logger, // [2] (권장) 로깅용
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm'; // [3] DataSource 추가
import { Bizword } from './entities/bizword.entity';
import { CreateBizwordDto } from './dto/create-bizword.dto';
import { UpdateBizwordDto } from './dto/update-bizword.dto';

@Injectable()
export class BizwordsService implements OnModuleInit { // [4] OnModuleInit 구현
  
  private readonly logger = new Logger(BizwordsService.name);

  constructor(
    @InjectRepository(Bizword)
    private readonly bizwordRepository: Repository<Bizword>,
    
    // [5] 올바른 DB "예열"을 위해 DataSource 주입
    private readonly dataSource: DataSource, 
  ) {}

  // [6] onModuleInit 수정: Repository 대신 DataSource 사용
  async onModuleInit() {
    this.logger.log('🚀 데이터베이스 연결 예열 시작...');
    try {
      // Repository가 아닌 DataSource로 쿼리해야 연결 자체를 보장합니다.
      await this.dataSource.query('SELECT 1');
      this.logger.log('✅ 데이터베이스 연결이 성공적으로 완료되었습니다.');
    } catch (error) {
      this.logger.error('❌ 데이터베이스 연결 실패:', error);
    }
  }

  // 용어 생성
  async create(createBizwordDto: CreateBizwordDto): Promise<Bizword> {
    
    // [7] desc 배열을 합쳐서 검색용 필드(desc_searchable)에 저장
    const bizword = this.bizwordRepository.create({
      ...createBizwordDto,
      // desc 배열의 요소들을 공백으로 합쳐서 검색용 필드에 저장
      desc_searchable: createBizwordDto.desc.join(' '), 
    });
    
    return this.bizwordRepository.save(bizword);
  }

  // 전체 용어 조회
  async findAll(searchTerm?: string): Promise<Bizword[]> {
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      return this.bizwordRepository.find({
        where: [
          // [8] 검색 로직 변경: desc 대신 desc_searchable 검색
          { word: Like(`%${lowerCaseSearch}%`) },
          { example: Like(`%${lowerCaseSearch}%`) }, // (JSON에 example이 있으니 추가)
          { desc_searchable: Like(`%${lowerCaseSearch}%`) }, // 이 필드를 검색
        ],
      });
    }
    // 검색어가 없으면 전체 조회
    return this.bizwordRepository.find();
  }

  // 특정 용어 조회 (ID 기준) - 변경 없음
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
    
    // DTO의 값들로 bizword 객체를 업데이트
    Object.assign(bizword, updateBizwordDto);

    // [9] 만약 desc 필드가 업데이트되었다면, 검색용 필드도 갱신
    if (updateBizwordDto.desc) {
      bizword.desc_searchable = updateBizwordDto.desc.join(' ');
    }
    
    return this.bizwordRepository.save(bizword);
  }

  // 용어 삭제 - 변경 없음
  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.bizwordRepository.delete(id);
    
    return { message: `Bizword with ID #${id} successfully removed` };
  }
}