import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/user.dto';
import { RoleEntity } from 'src/entity/role.entity';
import { UserEntity } from 'src/entity/user.entity';
import { Role } from 'src/enums/roles.enum';
import { In, Repository } from 'typeorm';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private rolesRepository: Repository<RoleEntity>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: {
          email
      }
  })
  }
  async create(user: CreateUserDto): Promise<User> {
    const existingRoles = await this.rolesRepository.find({ where: { id: In(user.roles) } });
    const newUser = this.usersRepository.create({
      ...user,
      roles: existingRoles,
    });
    return this.usersRepository.save(newUser);
  }
}