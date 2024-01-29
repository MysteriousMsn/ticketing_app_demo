// venues.controller.ts
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { VenuesService } from './venues.service';
import { VenueEntity } from 'src/entity/venue.entity';
import { VenueDto, venueSchema } from './venues.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { ZodValidationPipe } from 'src/utils/zod.validation';
import { Public } from 'src/decorators/public.decorator';

@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  @Public()
  async findAll(): Promise<VenueEntity[]> {
    return this.venuesService.findAllVenues();
  }

  @Get(':id')
  @Public()
  async findById(@Param('id') id: string): Promise<VenueEntity | undefined> {
    return this.venuesService.findVenueById(Number(id));
  }

  @Post()
  @Roles(Role.Admin)
  async create(
    @Body(new ZodValidationPipe(venueSchema)) createVenueDto: VenueDto,
  ): Promise<VenueEntity> {
    return this.venuesService.createVenue(createVenueDto);
  }

  @Put(':id')
  @Roles(Role.Admin)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(venueSchema)) updateVenueDto: VenueDto,
  ): Promise<VenueEntity | undefined> {
    return this.venuesService.updateVenue(Number(id), updateVenueDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: string): Promise<void> {
    return this.venuesService.deleteVenue(Number(id));
  }
}
