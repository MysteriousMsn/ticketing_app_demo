// booking.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, createBookingSchema } from './bookings.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { ZodValidationPipe } from 'src/utils/zod.validation';
import { Public } from 'src/decorators/public.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingsService) {}

  @Post()
  @Roles(Role.User, Role.Admin)
  create(
    @Req() request: Request,
    @Body(new ZodValidationPipe(createBookingSchema))
    createBookingDto: CreateBookingDto,
  ) {
    const userId = request['user'].id;
    return this.bookingService.create(createBookingDto, userId);
  }

  @Get('user')
  @Roles(Role.User, Role.Admin)
  findBookingsByUser(@Req() request: Request) {
    const user = request['user'];
    return this.bookingService.findBookingsByUser(user.id);
  }
  @Get(':id')
  @Roles(Role.User, Role.Admin)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.findOne(id);
  }

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.bookingService.findAll();
  }

  @Put(':id')
  @Roles(Role.User, Role.Admin)
  update(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(createBookingSchema))
    updateBookingDto: CreateBookingDto,
  ) {
    const userId = request['user'].id;
    return this.bookingService.update(id, updateBookingDto, userId);
  }

  @Delete(':id')
  @Roles(Role.User, Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.remove(id);
  }
}
