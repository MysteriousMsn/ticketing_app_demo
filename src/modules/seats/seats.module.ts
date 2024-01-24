import { Module } from '@nestjs/common';
import { VenueEntity } from 'src/entity/venue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles.guard';
import { RoleEntity } from 'src/entity/role.entity';
import { UserEntity } from 'src/entity/user.entity';
import { MovieEntity } from 'src/entity/movie.entity';
import { SeatsService } from '../seats/seats.service';
import { SeatsController } from './seats.controller';
import { SeatEntity } from 'src/entity/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeatEntity, UserEntity])],
  providers: [
    SeatsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [SeatsService, TypeOrmModule],
  controllers: [SeatsController],
})
export class SeatsModule {}
