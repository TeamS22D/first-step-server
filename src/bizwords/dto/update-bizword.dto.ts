import { PartialType } from '@nestjs/mapped-types';
import { CreateBizwordDto } from './create-bizword.dto';

export class UpdateBizwordDto extends PartialType(CreateBizwordDto) {}
