// location.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from 'src/entity/location.entity';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './locations.dto';
import { UpdateLocationDto } from '../bookings/bookings.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<LocationEntity> {
    const newLocation = this.locationRepository.create(createLocationDto);
    return this.locationRepository.save(newLocation);
  }

  async findAll(): Promise<LocationEntity[]> {
    return this.locationRepository.find();
  }

  async findOne(id: number): Promise<LocationEntity> {
    const location = await this.locationRepository.findOneBy({ id });
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    return location;
  }

  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<LocationEntity> {
    const location = await this.findOne(id);
    return this.locationRepository.save({ ...location, ...updateLocationDto });
  }

  async remove(id: number): Promise<void> {
    const location = await this.findOne(id);
    await this.locationRepository.remove(location);
  }
}
