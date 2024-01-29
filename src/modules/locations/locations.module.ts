import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserEntity } from 'src/entity/user.entity';
import { LocationEntity } from 'src/entity/location.entity';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, LocationEntity])],
  providers: [
    LocationsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [LocationsService, TypeOrmModule],
  controllers: [LocationsController],
})
export class LocationsModule {}
