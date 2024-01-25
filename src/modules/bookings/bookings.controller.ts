// booking.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, createBookingSchema } from './bookings.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { ZodValidationPipe } from 'src/utils/zod.validation';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}

  @Post()
  @Roles(Role.User)
  create(@Body(new ZodValidationPipe(createBookingSchema)) createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.findOne(id);
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(createBookingSchema)) updateBookingDto: CreateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.remove(id);
  }
}
