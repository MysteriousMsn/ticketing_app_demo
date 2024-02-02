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
  Patch,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  createBookingSchema,
  updateBookingSchema,
} from './bookings.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { ZodValidationPipe } from 'src/utils/zod.validation';
import { Request, Response } from 'express';

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
    const userId = request['user'].sub;
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
    @Body(new ZodValidationPipe(updateBookingSchema))
    updateBookingDto: UpdateBookingDto,
  ) {
    const userId = request['user'].sub;
    const isAdmin = request['isAdmin'];
    return this.bookingService.update(id, updateBookingDto, userId, isAdmin);
  }

  @Patch(':id')
  @Roles(Role.User, Role.Admin)
  async cancel(
    @Req() request: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = request['user'].sub;
    const data = await this.bookingService.cancel(id, userId);
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Booking cancelled successfully.',
      data: data,
    });
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.remove(id);
  }
}
