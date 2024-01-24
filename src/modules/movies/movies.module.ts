import { Module } from '@nestjs/common';
import { VenueEntity } from 'src/entity/venue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles.guard';
import { RoleEntity } from 'src/entity/role.entity';
import { UserEntity } from 'src/entity/user.entity';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MovieEntity } from 'src/entity/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity, UserEntity, RoleEntity, VenueEntity])],
  providers: [
    MoviesService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [MoviesService, TypeOrmModule],
  controllers: [MoviesController],
})
export class MoviesModule {}
