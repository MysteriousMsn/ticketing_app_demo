import { UpdateEventDto } from './../events/events.dto';
// venues.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VenueEntity } from 'src/entity/venue.entity';
import { CreateVenueDto, UpdateVenueDto } from './venues.dto';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(VenueEntity)
    private readonly venueRepository: Repository<VenueEntity>,
  ) {}

  async findAllVenues(): Promise<VenueEntity[]> {
    return this.venueRepository.find();
  }

  async findVenueById(id: number): Promise<VenueEntity | undefined> {
    return this.venueRepository.findOneBy({id});
  }

  async createVenue(venueDto: CreateVenueDto): Promise<VenueEntity> {
    const newVenue = this.venueRepository.create(venueDto);
    return this.venueRepository.save(newVenue);
  }

  async updateVenue(id: number, updateVenueDto: UpdateVenueDto): Promise<VenueEntity | undefined> {
    const existingVenue = await this.venueRepository.findOneBy({id});

    if (!existingVenue) {
      throw new NotFoundException('Venue not found');
    }

    this.venueRepository.merge(existingVenue, updateVenueDto);

    return this.venueRepository.save(existingVenue);
  }

  async deleteVenue(id: number): Promise<void> {
    const result = await this.venueRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
  }
}
