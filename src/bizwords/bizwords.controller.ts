import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BizwordsService } from './bizwords.service';
import { CreateBizwordDto } from './dto/create-bizword.dto';
import { UpdateBizwordDto } from './dto/update-bizword.dto';

@Controller('bizwords')
export class BizwordsController {
  constructor(private readonly bizwordsService: BizwordsService) {}

  // 용어 생성
  @Post()
  create(@Body() createBizwordDto: CreateBizwordDto) {
    return this.bizwordsService.create(createBizwordDto);
  }

  // 용어 검색
  @Get()
  findAll(@Query('search') searchTerm?: string) {
    return this.bizwordsService.findAll(searchTerm);
  }

  // 특정 용어 조회
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bizwordsService.findOne(id);
  }

  // 용어 수정
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBizwordDto: UpdateBizwordDto,
  ) {
    return this.bizwordsService.update(id, updateBizwordDto);
  }

  // 용어 삭제
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bizwordsService.remove(id);
  }
}