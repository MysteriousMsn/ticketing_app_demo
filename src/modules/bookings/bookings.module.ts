import { BookingEntity } from 'src/entity/booking.entity';
import { Module } from '@nestjs/common';
import { MovieEntity } from 'src/entity/movie.entity';
import { RoleEntity } from 'src/entity/role.entity';
import { UserEntity } from 'src/entity/user.entity';
import { VenueEntity } from 'src/entity/venue.entity';
import { RolesGuard } from 'src/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { SeatEntity } from 'src/entity/seat.entity';
import { TicketEntity } from 'src/entity/ticket.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BookingEntity, MovieEntity, UserEntity, SeatEntity, TicketEntity, RoleEntity, VenueEntity])],
    providers: [
      BookingsService,
      {
        provide: APP_GUARD,
        useClass: RolesGuard,
      },
    ],
    exports: [BookingsService, TypeOrmModule],
    controllers: [BookingsController],
  })
  export class BookingsModule {}