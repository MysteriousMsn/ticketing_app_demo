import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { RoleEntity } from './entity/role.entity';
import { VenueEntity } from './entity/venue.entity';
import { TicketEntity } from './entity/ticket.entity';
import { BookingEntity } from './entity/booking.entity';
import { VenuesController } from './modules/venues/venues.controller';
import { VenuesModule } from './modules/venues/venues.module';
import { MoviesModule } from './modules/movies/movies.module';
import { MovieEntity } from './entity/movie.entity';
import { SeatEntity } from './entity/seat.entity';
import { SeatsService } from './modules/seats/seats.service';
import { SeatsController } from './modules/seats/seats.controller';
import { SeatsModule } from './modules/seats/seats.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { BookingsController } from './modules/bookings/bookings.controller';
import { BookingsService } from './modules/bookings/bookings.service';
import { BookingsModule } from './modules/bookings/bookings.module';
import { LocationEntity } from './entity/location.entity';
import { LocationsController } from './modules/locations/locations.controller';
import { LocationsModule } from './modules/locations/locations.module';
import { StripeService } from './modules/stripe/stripe.service';
import { StripeModule } from './modules/stripe/stripe.module';
import { StripeController } from './modules/stripe/stripe.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventsGateway } from './modules/events/events.gateway';
@Module({
  imports: [
    AuthModule,
    UsersModule,
    VenuesModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(`${process.env.DB_PORT}`),
      username: `${process.env.DB_USERNAME}`,
      password: `${process.env.DB_PASSWORD}`,
      database: `${process.env.DB_DATABASE}`,
      entities: [
        UserEntity,
        RoleEntity,
        VenueEntity,
        TicketEntity,
        BookingEntity,
        MovieEntity,
        SeatEntity,
        TicketEntity,
        LocationEntity,
      ],
      synchronize: true,
    }),
    MoviesModule,
    SeatsModule,
    TicketsModule,
    BookingsModule,
    LocationsModule,
    StripeModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [
    AppController,
    VenuesController,
    SeatsController,
    BookingsController,
    LocationsController,
    StripeController,
  ],
  providers: [AppService, SeatsService, BookingsService, StripeService, EventsGateway],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
