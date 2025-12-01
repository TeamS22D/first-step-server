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
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { BizwordsService } from './bizwords.service';
import { CreateBizwordDto } from './dto/create-bizword.dto';
import { UpdateBizwordDto } from './dto/update-bizword.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/types/user-role.enum';

@Controller('bizwords')
export class BizwordsController {
  constructor(private readonly bizwordsService: BizwordsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createBizwordDto: CreateBizwordDto) {
    return this.bizwordsService.create(createBizwordDto);
  }

  @Get()
  findAll(@Query('searchTerm') searchTerm?: string) {
    return this.bizwordsService.findAll(searchTerm);
  }

  @Get('quiz')
  getQuiz() {
    return this.bizwordsService.getQuiz();
  }

  @Get('my/favorites')
  @UseGuards(AuthGuard)
  getMyFavorites(@Req() req) {
    const userId = req.user.userId;
    return this.bizwordsService.getMyFavorites(userId);
  }

  @Post('my/wrong-words')
  @UseGuards(AuthGuard)
  addWrongWord(@Body('wordId') wordId: number, @Req() req) {
    const userId = req.user.userId;
    return this.bizwordsService.addWrongWord(userId, wordId);
  }

  @Get('my/wrong-words')
  @UseGuards(AuthGuard)
  getWrongWords(@Req() req) {
    const userId = req.user.userId;
    return this.bizwordsService.getWrongWords(userId);
  }

  @Delete('my/wrong-words/:id')
  @UseGuards(AuthGuard)
  removeWrongWord(@Param('id', ParseIntPipe) wordId: number, @Req() req) {
    const userId = req.user.userId;
    return this.bizwordsService.removeWrongWord(userId, wordId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bizwordsService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBizwordDto: UpdateBizwordDto,
  ) {
    return this.bizwordsService.update(id, updateBizwordDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bizwordsService.remove(id);
  }

  @Post(':id/favorite')
  @UseGuards(AuthGuard)
  addFavorite(@Param('id', ParseIntPipe) wordId: number, @Req() req) {
    const userId = req.user.userId;
    return this.bizwordsService.addFavorite(userId, wordId);
  }

  @Delete(':id/favorite')
  @UseGuards(AuthGuard)
  removeFavorite(@Param('id', ParseIntPipe) wordId: number, @Req() req) {
    const userId = req.user.userId;
    return this.bizwordsService.removeFavorite(userId, wordId);
  }
}