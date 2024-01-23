import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { UsersService } from './users.service';
import { createUserSchema } from './user.validator';
import { ZodValidationPipe } from 'src/utils/zod.validation';
import { CreateUserDto } from 'src/dto/user.dto';

@Controller('users')
export class UsersController {
constructor(private userService: UsersService) {}

@Post('create')
@Roles(Role.Admin)
@UsePipes(new ZodValidationPipe(createUserSchema))
async create(@Body() createUserDto: CreateUserDto) {
  const user = await this.userService.create(createUserDto);
  return user;
}
}
