import {
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';
import { Bizword } from './entities/bizword.entity';
import { UserEntity } from '../entities/user.entity';
import { CreateBizwordDto } from './dto/create-bizword.dto';
import { UpdateBizwordDto } from './dto/update-bizword.dto';

@Injectable()
export class BizwordsService {
  private readonly logger = new Logger(BizwordsService.name);

  constructor(
    @InjectRepository(Bizword)
    private readonly bizwordRepository: Repository<Bizword>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createBizwordDto: CreateBizwordDto): Promise<Bizword> {
    const bizword = this.bizwordRepository.create({
      ...createBizwordDto,
      desc_searchable: createBizwordDto.desc.join(' '),
    });
    return this.bizwordRepository.save(bizword);
  }

  async findAll(searchTerm?: string): Promise<Bizword[]> {
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      return this.bizwordRepository.find({
        where: [
          { word: Like(`%${lowerCaseSearch}%`) },
          { example: Like(`%${lowerCaseSearch}%`) },
          { desc_searchable: Like(`%${lowerCaseSearch}%`) },
        ],
      });
    }
    return this.bizwordRepository.find();
  }

  async findOne(id: number): Promise<Bizword> {
    const bizword = await this.bizwordRepository.findOneBy({ id });

    if (!bizword) {
      throw new NotFoundException(`${id} not found.`);
    }
    return bizword;
  }

  async update(
    id: number,
    updateBizwordDto: UpdateBizwordDto,
  ): Promise<Bizword> {
    const bizword = await this.findOne(id);

    Object.assign(bizword, updateBizwordDto);

    if (updateBizwordDto.desc) {
      bizword.desc_searchable = updateBizwordDto.desc.join(' ');
    }

    return this.bizwordRepository.save(bizword);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.bizwordRepository.delete(id);

    return { message: `${id} deleted.` };
  }

  async addFavorite(userId: number, wordId: number) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['favorites'],
    });

    if (!user) throw new NotFoundException('User not found.');

    const isExist = user.favorites.some((word) => word.id === wordId);
    if (isExist) {
      throw new ConflictException('already in your favorites.');
    }

    const word = await this.findOne(wordId);

    user.favorites.push(word);
    await this.userRepository.save(user);

    return { message: 'Added favorites.' };
  }

  async removeFavorite(userId: number, wordId: number) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['favorites'],
    });

    if (!user) throw new NotFoundException('User not found.');

    user.favorites = user.favorites.filter((word) => word.id !== wordId);

    await this.userRepository.save(user);

    return { message: 'Removed favorites.' };
  }

  async getMyFavorites(userId: number) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['favorites'],
    });

    if (!user) throw new NotFoundException('User not found.');

    return user.favorites;
  }
}
