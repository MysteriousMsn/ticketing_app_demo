// booking.service.ts
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BookingEntity } from 'src/entity/booking.entity';
import { CreateBookingDto, UpdateBookingDto } from './bookings.dto';
import { UserEntity } from 'src/entity/user.entity';
import { SeatEntity } from 'src/entity/seat.entity';
import { VenueEntity } from 'src/entity/venue.entity';
import { MovieEntity } from 'src/entity/movie.entity';
import { TicketEntity } from 'src/entity/ticket.entity';
import * as moment from 'moment-timezone';
@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,

    private dataSource: DataSource,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: number,
  ): Promise<BookingEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { seatIds, totalSeats, venueId, movieId } = createBookingDto;

      const [user, seats, venue, movie] = await Promise.all([
        queryRunner.manager
          .createQueryBuilder(UserEntity, 'user')
          .where('id = :userId', { userId })
          .andWhere('status = :status', { status: 1 })
          .getOne(),
        queryRunner.manager
          .createQueryBuilder(SeatEntity, 'seat')
          .innerJoinAndSelect('seat.ticket', 'ticket')
          .innerJoinAndSelect('seat.venue', 'venue')
          .where('seat.id IN(:seatIds)', { seatIds })
          .andWhere('venue.id =:venueId', { venueId })
          .andWhere('seat.status =:status', { status: 1 })
          .getMany(),
        queryRunner.manager
          .createQueryBuilder(VenueEntity, 'venue')
          .where('id = :venueId', { venueId })
          .andWhere('status = :status', { status: 1 })
          .getOne(),
        queryRunner.manager
          .createQueryBuilder(MovieEntity, 'movie')
          .where('id = :movieId', { movieId })
          .andWhere('status = :status', { status: 1 })
          .getOne(),
      ]);
      if (!user || !seats?.length || !venue || !movie) {
        throw new NotFoundException('One or more related entities not found');
      }
      const reservedSeats = seats.filter((s) => s.isReserved).map((s) => s.id);
      if (totalSeats !== seatIds.length) {
        throw new ConflictException(`Please select all the required seats.`);
      }
      if (reservedSeats?.length) {
        throw new ConflictException(
          `Seat ${reservedSeats.join(',')} already reserved.`,
        );
      }
      const seatNotAvailable = [];
      seats.forEach((seat) => {
        seat.isReserved = true;
        if (!seatIds.includes(seat.id)) {
          seatNotAvailable.push(seat.id);
        }
      });
      if (seatNotAvailable.length) {
        throw new ConflictException(
          `Seat ${seatNotAvailable.join(',')} not available.`,
        );
      }
      let amount = 0;
      const tickets = seats.map((s) => {
        amount += s.ticket.price;
        return s.ticket;
      });
      const newBooking = this.bookingRepository.create({
        user: user,
        seats: seats,
        venue: venue,
        movie: movie,
        tickets,
        totalSeats,
        amount,
      });

      const savedBooking = await queryRunner.manager.save(newBooking);
      await queryRunner.commitTransaction();
      return savedBooking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          status: error.status,
          error: error,
        },
        error.status,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number): Promise<BookingEntity> {
    const booking = await this.bookingRepository.findOneBy({ id });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async findAll(): Promise<BookingEntity[]> {
    const bookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoinAndSelect('booking.user', 'user')
      .innerJoinAndSelect('booking.seats', 'seats')
      .innerJoinAndSelect('booking.venue', 'venue')
      .innerJoinAndSelect('booking.movie', 'movie')
      .innerJoinAndSelect('booking.ticket', 'ticket')
      .getMany();
    return bookings;
  }
  async findBookingsByUser(userId: number): Promise<BookingEntity[]> {
    const bookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoinAndSelect('booking.user', 'user')
      .innerJoinAndSelect('booking.seats', 'seats')
      .innerJoinAndSelect('booking.venue', 'venue')
      .innerJoinAndSelect('booking.movie', 'movie')
      .innerJoinAndSelect('booking.ticket', 'ticket')
      .where('user.id =:userId', { userId })
      .getMany();
    return bookings;
  }

  async update(
    bookingId: number,
    updateBookingDto: UpdateBookingDto,
    userId: number,
    isAdmin: boolean,
  ): Promise<BookingEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let bookingQuery = queryRunner.manager
        .createQueryBuilder(BookingEntity, 'booking')
        .innerJoinAndSelect('booking.seats', 'seats')
        .innerJoinAndSelect('booking.user', 'user')
        .where('booking.id = :bookingId', { bookingId });

      if (!isAdmin) {
        bookingQuery.andWhere('user.id = :userId', { userId });
      }

      const { seatIds, totalSeats, venueId, movieId } = updateBookingDto;
      const [booking, user, seats, venue, movie] = await Promise.all([
        bookingQuery.setLock('pessimistic_write').getOne(),
        queryRunner.manager
          .createQueryBuilder(UserEntity, 'user')
          .where('id = :userId', { userId })
          .andWhere('status = :status', { status: 1 })
          .getOne(),
        queryRunner.manager
          .createQueryBuilder(SeatEntity, 'seat')
          .innerJoinAndSelect('seat.ticket', 'ticket')
          .innerJoinAndSelect('seat.venue', 'venue')
          .where('seat.id IN(:seatIds)', { seatIds })
          .andWhere('venue.id =:venueId', { venueId })
          .andWhere('seat.status =:status', { status: 1 })
          .getMany(),
        queryRunner.manager
          .createQueryBuilder(VenueEntity, 'venue')
          .where('id = :venueId', { venueId })
          .andWhere('status = :status', { status: 1 })
          .getOne(),
        queryRunner.manager
          .createQueryBuilder(MovieEntity, 'movie')
          .where('id = :movieId', { movieId })
          .andWhere('status = :status', { status: 1 })
          .getOne(),
      ]);

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      if (booking.status !== 1) {
        throw new ConflictException(
          `Cannot edit a booking that is either cancelled, failed or expired`,
        );
      }
      if (!user || !seats?.length || !venue || !movie) {
        throw new NotFoundException('One or more related entities not found');
      }

      const allReservedSeats = seats
        .filter((s) => s.isReserved)
        .map((s) => s.id);

      const selfReservedSeats = booking.seats.map((s) => s.id);

      const seatIdsReservedByOthers = allReservedSeats.filter(
        (id) => !selfReservedSeats.includes(id),
      );

      if (totalSeats !== seatIds.length) {
        throw new ConflictException(`Please select all the required seats.`);
      }

      if (allReservedSeats?.length && seatIdsReservedByOthers.length) {
        throw new ConflictException(
          `Seat ${allReservedSeats.join(',')} already reserved.`,
        );
      }
      booking.seats.forEach((seat) => {
        seat.isReserved = false;
        seat.temporaryLockExpiry = null;
      });
      await queryRunner.manager.save(booking);

      const lockedSeats = seats.filter(
        (seat) =>
          seat.temporaryLockExpiry && seat.temporaryLockExpiry > new Date(),
      );

      if (lockedSeats.length > 0) {
        throw new ConflictException('Seat is temporarily locked');
      }
      let amount = 0;
      const tickets = seats.map((s) => {
        s.isReserved = true;
        const temporaryLockDurationInMinutes = 5;

        const now = new Date();
        const temporaryLockExpiry = new Date(
          now.getTime() + temporaryLockDurationInMinutes * 60000,
        );
        s.temporaryLockExpiry = temporaryLockExpiry;
        amount += s.ticket.price;
        return s.ticket;
      });

      booking.user = user;
      booking.seats = seats;
      booking.venue = venue;
      booking.movie = movie;
      booking.tickets = tickets;
      booking.totalSeats = totalSeats;
      booking.amount = amount;

      const existingBooking = await queryRunner.manager
        .createQueryBuilder(BookingEntity, 'booking')
        .where('id = :bookingId', { bookingId: booking.id })
        .andWhere('updatedDate = :updatedDate', {
          updatedDate: updateBookingDto.bookingUpdatedDate,
        })
        .getOne();

      if (!existingBooking) {
        throw new BadRequestException('Document is locked');
      }

      const savedBooking = await queryRunner.manager.save(booking);
      await queryRunner.commitTransaction();
      return savedBooking;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          status: error.status,
          error: error,
        },
        error.status,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async cancel(bookingId: number, userId: number): Promise<BookingEntity> {
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoinAndSelect('booking.seats', 'seats')
      .innerJoinAndSelect('booking.user', 'user')
      .where('booking.id = :bookingId', { bookingId })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.status === 0) {
      throw new ConflictException(`Booking already cancelled`);
    }
    if (booking.status !== 1) {
      throw new ConflictException(
        `Cannot edit a booking that is either cancelled, failed or expired`,
      );
    }
    if (booking?.seats?.filter((s) => !s.isReserved).length) {
      throw new ConflictException(
        'Cannot cancel, all seats are not reserved for you',
      );
    }
    // booking.seat.isReserved = false;
    booking.seats.forEach((seat) => {
      seat.isReserved = false;
    });
    booking.status = 0;

    const savedBooking = await this.bookingRepository.save(booking);
    return savedBooking;
  }

  async remove(id: number): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepository.remove(booking);
  }
}
