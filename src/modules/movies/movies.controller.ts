import { Controller, Get, Param, Post, Body, Put, Delete, UsePipes } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { MoviesService } from './movies.service';
import { MovieDto, MovieSchema } from './movies.dto';
import { MovieEntity } from 'src/entity/movie.entity';
import { ZodValidationPipe } from 'src/utils/zod.validation';
import { Public } from 'src/decorators/public.decorator';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @Public()
  async findAll(): Promise<MovieEntity[]> {
    return this.moviesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<MovieEntity | undefined> {
    return this.moviesService.findById(Number(id));
  }
  @Post()
  @Roles(Role.Admin)
  async create(@Body(new ZodValidationPipe(MovieSchema)) createMovieDto: MovieDto): Promise<MovieEntity> {
    return this.moviesService.create(createMovieDto);
  }
  @Put(':id')
  @Roles(Role.Admin)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(MovieSchema)) updateMovieDto: MovieDto
    ): Promise<MovieEntity | undefined> {
    return this.moviesService.update(Number(id), updateMovieDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: string): Promise<void> {
    return this.moviesService.delete(Number(id));
  }
}
