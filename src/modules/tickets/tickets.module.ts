import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles.guard';
import { TicketEntity } from 'src/entity/ticket.entity';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { UserEntity } from 'src/entity/user.entity';
import { VenuesService } from '../venues/venues.service';
import { VenueEntity } from 'src/entity/venue.entity';
import { MovieEntity } from 'src/entity/movie.entity';
import { SeatsService } from '../seats/seats.service';
import { SeatEntity } from 'src/entity/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity, UserEntity, VenueEntity, MovieEntity, SeatEntity])],
  providers: [
    TicketsService,
    VenuesService,
    SeatsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [TicketsService, TypeOrmModule],
  controllers: [TicketsController],
})
export class TicketsModule {}
