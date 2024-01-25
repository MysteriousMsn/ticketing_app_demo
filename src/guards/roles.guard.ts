import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<number[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const dbUser = await this.userRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.roles', 'roles')
      .where('u.id = :usersId', { usersId: user.sub })
      .getOne();
      
    user.roles = dbUser.roles.map(r => r.id);
    const isAuthorized = requiredRoles.some((role) =>
      user.roles?.includes(role),
    );
    if (!isAuthorized) {
      throw new UnauthorizedException('You are not authorized');
    }
    return true;
  }
}
