import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email, pass) {
    const user = await this.usersService.findUserWithRoles(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (!user?.status) {
      throw new UnauthorizedException(
        'Your account is inactive, please write to customer support.',
      );
    }
    // if (user?.password !== pass) {
    //   throw new UnauthorizedException('Invalid password');
    // }
    const isPasswordMatch = await user?.compareHash(pass);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      status: user.status,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
