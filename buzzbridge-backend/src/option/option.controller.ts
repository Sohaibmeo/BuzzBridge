import {
  Body,
  Controller,
  Delete,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateOptionDto } from './dto/option.dto';
import { OptionService } from './option.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Request } from 'express';
import { User } from 'src/entity/user.entity';

@Controller('option')
export class OptionController {
  private readonly logger = new Logger(OptionController.name);
  constructor(private readonly optionService: OptionService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createOption(@Req() req: Request, @Body() body: CreateOptionDto) {
    try {
      return await this.optionService.createOption({
        ...body,
        belongsTo: req.user as User,
      });
    } catch (error) {
      this.logger.error(error);
      throw error.detail;
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  deleteOption(@Param('id') id: number) {
    return this.optionService.deleteOption(id);
  }
}
