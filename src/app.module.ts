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
import { EventEntity } from './entity/event.entity';
import { VenueEntity } from './entity/venue.entity';
import { TicketEntity } from './entity/ticket.entity';
import { BookingEntity } from './entity/booking.entity';
@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host :process.env.DB_HOST,
      port: Number(`${process.env.DB_PORT}`),
      username: `${process.env.DB_USERNAME}`,
      password: `${process.env.DB_PASSWORD}`,
      database: `${process.env.DB_DATABASE}`,
      entities: [
        UserEntity,
        RoleEntity,
        EventEntity,
        VenueEntity,
        TicketEntity,
        BookingEntity
      ],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
