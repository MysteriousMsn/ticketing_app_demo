import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dto/user.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('users')
export class UsersController {
constructor(private userService: UsersService) {}

@Post('create')
@Roles(Role.Admin)
create(@Body() createUserDto: CreateUserDto) {
  return this.userService.create(createUserDto);
}
}
