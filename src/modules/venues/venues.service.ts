import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { VenueEntity } from 'src/entity/venue.entity';
import { VenueDto } from './venues.dto';
import { MovieEntity } from 'src/entity/movie.entity';
import { SeatsService } from '../seats/seats.service';
import { LocationEntity } from 'src/entity/location.entity';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(VenueEntity)
    private readonly venueRepository: Repository<VenueEntity>,
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
    @Inject(SeatsService)
    private readonly seatService: SeatsService,
  ) {}

  async findAllVenues(): Promise<VenueEntity[]> {
    return this.venueRepository.find();
  }

  async findVenueById(id: number): Promise<VenueEntity | undefined> {
    return this.venueRepository.findOneBy({ id });
  }

  async createVenue(createVenueDto: VenueDto): Promise<VenueEntity> {
    let existingMovies: MovieEntity[] = [];
    if (createVenueDto?.movies?.length) {
      existingMovies = await this.movieRepository.find({
        where: { id: In(createVenueDto?.movies) },
      });
      if (!existingMovies.length) {
        throw new NotFoundException('movies not found');
      }
    }
    let location;
    if (createVenueDto?.location) {
      location = await this.locationRepository.find({
        where: { id: createVenueDto?.location },
      });
      if (!location) {
        throw new NotFoundException('location not found');
      }
    }
    const newVenue = this.venueRepository.create({
      ...createVenueDto,
      location,
      movies: existingMovies,
    });
    const savedVenue = await this.venueRepository.save(newVenue);
    await this.seatService.createSeatsForVenue(savedVenue);

    return savedVenue;
  }

  async updateVenue(
    id: number,
    updateVenueDto: VenueDto,
  ): Promise<VenueEntity | undefined> {
    const existingVenue = await this.venueRepository.findOneBy({ id });
    let existingMovies: MovieEntity[];
    if (updateVenueDto?.movies.length) {
      existingMovies = await this.movieRepository.find({
        where: { id: In(updateVenueDto.movies) },
      });
      if (!existingMovies?.length) {
        throw new NotFoundException('Movie not found');
      }
    }
    if (!existingVenue) {
      throw new NotFoundException('Venue not found');
    }

    // return this.venueRepository.save(existingVenue);
    const updatedVenue = Object.assign(existingVenue, updateVenueDto);
    return this.movieRepository.save({
      ...updatedVenue,
      movies: existingMovies,
    });
  }

  async deleteVenue(id: number): Promise<void> {
    const result = await this.venueRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
  }
}
