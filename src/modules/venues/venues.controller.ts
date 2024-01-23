// venues.controller.ts
import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { VenueEntity } from 'src/entity/venue.entity';
import { CreateVenueDto, UpdateVenueDto } from './venues.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';

@Roles(Role.Admin)
@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  async findAllVenues(): Promise<VenueEntity[]> {
    return this.venuesService.findAllVenues();
  }

  @Get(':id')
  async findVenueById(@Param('id') id: string): Promise<VenueEntity | undefined> {
    return this.venuesService.findVenueById(Number(id));
  }

  @Post()
  async createVenue(@Body() venueDto: CreateVenueDto): Promise<VenueEntity> {
    return this.venuesService.createVenue(venueDto);
  }

  @Put(':id')
  async updateVenue(@Param('id') id: string, @Body() venueDto: UpdateVenueDto): Promise<VenueEntity | undefined> {
    return this.venuesService.updateVenue(Number(id), venueDto);
  }

  @Delete(':id')
  async deleteVenue(@Param('id') id: string): Promise<void> {
    return this.venuesService.deleteVenue(Number(id));
  }
}
