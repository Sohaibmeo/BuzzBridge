import { IsInt, IsOptional, IsString } from 'class-validator';
import { Poll } from '../../entity/poll.entity';
import { User } from '../../entity/user.entity';

export class CreateOptionDto {
  @IsString()
  title: string;

  @IsInt()
  poll: Poll;

  @IsString()
  @IsOptional()
  belongsTo?: User;
}
