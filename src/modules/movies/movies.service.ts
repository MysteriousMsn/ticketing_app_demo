import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MovieDto } from './movies.dto';
import { MovieEntity } from 'src/entity/movie.entity';
import { VenueEntity } from 'src/entity/venue.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    @InjectRepository(VenueEntity)
    private readonly venueRepository: Repository<VenueEntity>,
  ) {}

  async findAll(): Promise<MovieEntity[]> {
    return this.movieRepository.find();
  }

  async findById(id: number): Promise<MovieEntity | undefined> {
    return this.movieRepository.findOneBy({id});
  }

  async create(createMovieDto: MovieDto): Promise<MovieEntity> {
    let existingVenues: VenueEntity[] = [];
    if(createMovieDto?.venues?.length){
      existingVenues = await this.venueRepository.find({ where: { id: In(createMovieDto.venues) } });
      if (!existingVenues.length) {
        throw new NotFoundException('venues not found');
      }
    }
    const newMovie = this.movieRepository.create({
      ...createMovieDto,
      venues: existingVenues,
    });
    return this.movieRepository.save(newMovie);
  }

  async update(id: number, updateMovieDto: MovieDto): Promise<MovieEntity | undefined> {
    const existingVenues = await this.venueRepository.find({ where: { id: In(updateMovieDto.venues) } });
    const existingMovie = await this.movieRepository.findOneBy({id});

    if (!existingMovie) {
      throw new NotFoundException('Movie not found');
    }
    const updatedMovie = Object.assign(existingMovie, updateMovieDto);
    return this.movieRepository.save({...updatedMovie, venues: existingVenues});
  }

  async delete(id: number): Promise<void> {
    const result = await this.movieRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  }
}
