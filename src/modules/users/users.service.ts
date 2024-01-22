import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user.dto';
import { Role } from 'src/enums/roles.enum';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users: CreateUserDto[] = [
    {
      userId: 1,
      username: 'admin',
      password: '123456',
      roles: [Role.Admin],
    },
    {
      userId: 2,
      username: 'user_one',
      password: '123456',
      roles: [Role.User],
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
  async create(user: CreateUserDto): Promise<User> {
    return this.users.push(user);
  }
}