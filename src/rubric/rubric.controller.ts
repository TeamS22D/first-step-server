import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RubricService } from './rubric.service';
import { AuthGuard } from '@nestjs/passport';
import { RubricDto } from '../dto/rubric-dto';

@Controller('rubric')
export class RubricController {
  constructor(private readonly rubricService: RubricService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  async createRubric(@Body() dto: RubricDto.createDto) {
    return this.rubricService.createRubric(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/update')
  async updateRubric(@Body() dto: RubricDto.updateDto) {
    return this.rubricService.updateRubric(dto);
  }

  @Get('/find-all')
  async findAll() {
    return this.rubricService.findAll();
  }

  @Get('/:id')
  async findById(@Param('id') id: number) {
    return this.rubricService.findOne(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/:id')
  async delete(@Param('id') id: number) {
    return this.rubricService.delete(Number(id));
  }
}
