// location.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './locations.dto';
import { UpdateLocationDto } from '../bookings/bookings.dto';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationService: LocationsService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.locationService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.Admin)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.remove(id);
  }
}
