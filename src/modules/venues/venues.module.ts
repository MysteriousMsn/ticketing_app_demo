import { Module } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { VenueEntity } from 'src/entity/venue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenuesController } from './venues.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles.guard';
import { RoleEntity } from 'src/entity/role.entity';
import { UserEntity } from 'src/entity/user.entity';
import { MovieEntity } from 'src/entity/movie.entity';
import { SeatsService } from '../seats/seats.service';
import { SeatEntity } from 'src/entity/seat.entity';
import { LocationEntity } from 'src/entity/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VenueEntity,
      UserEntity,
      RoleEntity,
      MovieEntity,
      SeatEntity,
      LocationEntity,
    ]),
  ],
  providers: [
    VenuesService,
    SeatsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [VenuesService, TypeOrmModule],
  controllers: [VenuesController],
})
export class VenuesModule {}
