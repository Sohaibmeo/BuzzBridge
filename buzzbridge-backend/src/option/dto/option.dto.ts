import { IsInt, IsOptional, IsString } from 'class-validator';
import { Poll } from 'src/entity/poll.entity';
import { User } from 'src/entity/user.entity';

export class CreateOptionDto {
  @IsString()
  title: string;

  @IsInt()
  poll: Poll;

  @IsString()
  @IsOptional()
  belongsTo?: User;
}
