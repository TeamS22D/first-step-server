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
import { AuthGuard } from '@nestjs/passport';
import { BizwordsService } from './bizwords.service';
import { CreateBizwordDto } from './dto/create-bizword.dto';
import { UpdateBizwordDto } from './dto/update-bizword.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/types/user-role.enum';

@Controller('bizwords')
export class BizwordsController {
  constructor(private readonly bizwordsService: BizwordsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createBizwordDto: CreateBizwordDto) {
    return this.bizwordsService.create(createBizwordDto);
  }

  @Get()
  findAll(@Query('searchTerm') searchTerm?: string) {
    return this.bizwordsService.findAll(searchTerm);
  }

  @Get('my/favorites')
  @UseGuards(AuthGuard('jwt'))
  getMyFavorites(@Req() req) {
    const userId = req.user.userId;
    return this.bizwordsService.getMyFavorites(userId);
  }

  @Get('quiz')
  getQuiz() {
    return this.bizwordsService.getQuiz();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bizwordsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBizwordDto: UpdateBizwordDto,
  ) {
    return this.bizwordsService.update(id, updateBizwordDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bizwordsService.remove(id);
  }

  @Post(':id/favorite')
  @UseGuards(AuthGuard('jwt'))
  addFavorite(@Param('id', ParseIntPipe) wordId: number, @Req() req) {
    const userId = req.user.userId;
    return this.bizwordsService.addFavorite(userId, wordId);
  }

  @Delete(':id/favorite')
  @UseGuards(AuthGuard('jwt'))
  removeFavorite(@Param('id', ParseIntPipe) wordId: number, @Req() req) {
    const userId = req.user.userId;
    return this.bizwordsService.removeFavorite(userId, wordId);
  }
}