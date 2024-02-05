import { UserEntity } from 'src/entity/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeService } from './stripe.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles.guard';
import { RoleEntity } from 'src/entity/role.entity';
import { StripeController } from './stripe.controller';
import { BookingEntity } from 'src/entity/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, BookingEntity])],
  providers: [
    StripeService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [StripeService, TypeOrmModule],
  controllers: [StripeController],
})
export class StripeModule {}
