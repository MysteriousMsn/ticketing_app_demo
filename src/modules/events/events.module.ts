import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventEntity } from '../../entity/event.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserEntity } from 'src/entity/user.entity';
import { RoleEntity } from 'src/entity/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, UserEntity, RoleEntity])],
  providers: [
    EventsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [EventsService, TypeOrmModule],
  controllers: [EventsController],
})
export class EventsModule {}
