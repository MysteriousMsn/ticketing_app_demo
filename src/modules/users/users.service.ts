import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/entity/role.entity';
import { UserEntity } from 'src/entity/user.entity';
import { In, Not, Repository } from 'typeorm';
import { CreateUserDto, SignupUserDto } from './users.dto';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private rolesRepository: Repository<RoleEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: {
          email
      }
  })
  }
  async findUserWithRoles(email: string): Promise<UserEntity | undefined> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.email = :email', { email })
      .getOne();
  }
  async create(user: CreateUserDto): Promise<User> {
    const existingRoles = await this.rolesRepository.find({ where: { id: In(user.roles) } });
    const newUser = this.usersRepository.create({
      ...user,
      roles: existingRoles,
    });
    return this.usersRepository.save(newUser);
  }
  async update(id: number, updateUserDto: CreateUserDto): Promise<UserEntity | undefined> {
    const existingUser = await this.usersRepository.findOneBy({id});
    const existingRoles = await this.rolesRepository.find({ where: { id: In(updateUserDto.roles) } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const anotherUser = await this.usersRepository.findOne({where: {
      id: Not(existingUser.id),
      email: updateUserDto.email,
    }})
    if(anotherUser){
      throw new BadRequestException('User already exist with this email');
    }
    const updatedUser = Object.assign(existingUser, updateUserDto);
    return this.usersRepository.save({...updatedUser, roles: existingRoles});
  }
  async delete(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
  async signup(user: SignupUserDto): Promise<User> {
    const existingRoles = await this.rolesRepository.find({ where: { id: In([2]) } });
    const newUser = this.usersRepository.create({
      ...user,
      roles: existingRoles,
    });
    return this.usersRepository.save(newUser);
  }
}