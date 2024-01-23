import { Module } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { VenueEntity } from 'src/entity/venue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenuesController } from './venues.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles.guard';
import { RoleEntity } from 'src/entity/role.entity';
import { UserEntity } from 'src/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VenueEntity, UserEntity, RoleEntity])],
  providers: [
    VenuesService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [VenuesService, TypeOrmModule],
  controllers: [VenuesController],
})
export class VenuesModule {}
