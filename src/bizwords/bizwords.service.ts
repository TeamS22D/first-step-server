import {
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';
import { Bizword } from './entities/bizword.entity';
import { UserEntity } from 'src/user/entities/user.entity';
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
    const selectColumns: (keyof Bizword)[] = ['id', 'word', 'desc', 'example'];
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      return this.bizwordRepository.find({
        where: [
          { word: Like(`%${lowerCaseSearch}%`) },
          { example: Like(`%${lowerCaseSearch}%`) },
          { desc_searchable: Like(`%${lowerCaseSearch}%`) },
        ],
        select: selectColumns,
      });
    }
    return this.bizwordRepository.find({ select: selectColumns });
  }

  async getQuiz() {
    const rawWords = await this.bizwordRepository
      .createQueryBuilder('bizword')
      .orderBy('RAND()')
      .take(10)
      .getMany();

    const uniqueWords: Bizword[] = [];
    const seenDescriptions = new Set<string>();

    for (const word of rawWords) {
      const description = word.desc[0];

      if (!seenDescriptions.has(description)) {
        seenDescriptions.add(description);
        uniqueWords.push(word);
      }

      if (uniqueWords.length === 4) break;
    }

    if (uniqueWords.length < 4) {
      throw new BadRequestException('Not enough unique words for a quiz');
    }

    const answerWord = uniqueWords[0];

    const options = uniqueWords.map((word) => ({
      wordId: word.id,
      description: word.desc[0],
    }));

    options.sort(() => Math.random() - 0.5);

    return {
      quiz: {
        id: answerWord.id,
        word: answerWord.word,
      },
      options: options,
    };
  }

  async addWrongWord(userId: number, wordId: number) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['wrongWords'],
    });

    if (!user) throw new NotFoundException('User not found.');

    const isExist = user.wrongWords.some((w) => w.id === wordId);
    if (!isExist) {
      const word = await this.findOne(wordId);
      user.wrongWords.push(word);
      await this.userRepository.save(user);
    }

    return { message: 'Saved to wrong answer note.' };
  }

    async getWrongWords(userId: number) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['wrongWords'],
    });

    if (!user) throw new NotFoundException('User not found.');

    return user.wrongWords.map((word) => ({
      word: word.word,
      desc: word.desc,
      example: word.example,
    }));
  }

  async removeWrongWord(userId: number, wordId: number) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['wrongWords'],
    });

    if (!user) throw new NotFoundException('User not found.');

    user.wrongWords = user.wrongWords.filter((w) => w.id !== wordId);
    await this.userRepository.save(user);

    return { message: 'Removed from wrong answer note.' };
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