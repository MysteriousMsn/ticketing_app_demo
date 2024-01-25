import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UsePipes } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { User, UsersService } from './users.service';
import { CreateUserDto, SignupUserDto, createUserSchema, signupUserSchema } from './users.dto';
import { ZodValidationPipe } from 'src/utils/zod.validation';
import { Public } from 'src/decorators/public.decorator';
import { UserEntity } from 'src/entity/user.entity';

@Controller('users')
export class UsersController {
constructor(private userService: UsersService) {}

@Get()
@Roles(Role.Admin)
async findAll(): Promise<User[]> {
  return this.userService.findAll();
}
@Post()
@Roles(Role.Admin)
@UsePipes(new ZodValidationPipe(createUserSchema))
async create(@Body() createUserDto: CreateUserDto) {
  const existingUser = await this.userService.findOne(createUserDto.email);
  if(existingUser){
    throw new BadRequestException('User already exist');
  }
  const user = await this.userService.create(createUserDto);
  return user;
}

@Put(':id')
@Roles(Role.Admin)
async update(
  @Param('id') id: string,
  @Body(new ZodValidationPipe(createUserSchema)) updateUserDto: CreateUserDto): Promise<UserEntity | undefined> {
  return this.userService.update(Number(id), updateUserDto);
}
@Delete(':id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(Number(id));
}
@Post('signup')
@Public()
@UsePipes(new ZodValidationPipe(signupUserSchema))
async signup(@Body() signupUserDto: SignupUserDto) {
  const existingUser = await this.userService.findOne(signupUserDto.email);
  if(existingUser){
    throw new BadRequestException('User already exist');
  }
  const user = await this.userService.signup(signupUserDto);
  return user;
}
}
