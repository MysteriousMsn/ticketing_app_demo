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
import { CreateBookingDto } from './bookings.dto';
import { UserEntity } from 'src/entity/user.entity';
import { SeatEntity } from 'src/entity/seat.entity';
import { VenueEntity } from 'src/entity/venue.entity';
import { MovieEntity } from 'src/entity/movie.entity';
import { TicketEntity } from 'src/entity/ticket.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(SeatEntity)
    private readonly seatRepository: Repository<SeatEntity>,

    @InjectRepository(VenueEntity)
    private readonly venueRepository: Repository<VenueEntity>,

    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,

    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,

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
      const { seatIds, totalSeats, venueId, movieId, ticketId } =
        createBookingDto;

      const [user, seats, venue, movie, ticket] = await Promise.all([
        queryRunner.query('SELECT * FROM users WHERE id = ? AND status = ?', [
          userId,
          1,
        ]),
        queryRunner.query('SELECT * FROM seats WHERE id in(?) AND status = ?', [
          seatIds,
          1,
        ]),
        queryRunner.query('SELECT * FROM venues WHERE id = ? AND status = ?', [
          venueId,
          1,
        ]),
        queryRunner.query('SELECT * FROM movies WHERE id = ? AND status = ?', [
          movieId,
          1,
        ]),
        queryRunner.query('SELECT * FROM tickets WHERE id = ? AND status = ?', [
          ticketId,
          1,
        ]),
      ]);
      // const [user, seat, venue, movie, ticket] = await Promise.all([
      //   this.userRepository.findOneBy({ id: userId }),
      //   this.seatRepository.findOneBy({ id: seatId }),
      //   this.venueRepository.findOneBy({ id: venueId }),
      //   this.movieRepository.findOneBy({ id: movieId }),
      //   this.ticketRepository.findOneBy({ id: ticketId }),
      // ]);
      if (
        !user?.length ||
        !seats?.length ||
        !venue?.length ||
        !movie?.length ||
        !ticket?.length
      ) {
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
      // if (seat[0].isReserved) {
      //   throw new ConflictException('Seat is already reserved');
      // }
      // seat[0].isReserved = true;
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
      const newBooking = this.bookingRepository.create({
        user: user[0],
        seats: seats,
        venue: venue[0],
        movie: movie[0],
        ticket: ticket[0],
      });
      // const savedBooking = await this.bookingRepository.save(newBooking);
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
    updateBookingDto: CreateBookingDto,
    userId: number,
    isAdmin: boolean,
  ): Promise<BookingEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let bookingQuery = this.bookingRepository
        .createQueryBuilder('booking')
        .innerJoinAndSelect('booking.seats', 'seats')
        .innerJoinAndSelect('booking.user', 'user')
        .where('booking.id = :bookingId', { bookingId });

      if (!isAdmin) {
        bookingQuery.andWhere('user.id = :userId', { userId });
      }

      const { seatIds, totalSeats, venueId, movieId, ticketId } =
        updateBookingDto;
      const [booking, user, seats, venue, movie, ticket] = await Promise.all([
        bookingQuery.getOne(),
        queryRunner.query('SELECT * FROM users WHERE id = ? AND status = ?', [
          userId,
          1,
        ]),
        queryRunner.query('SELECT * FROM seats WHERE id In(?) AND status = ?', [
          seatIds,
          1,
        ]),
        queryRunner.query('SELECT * FROM venues WHERE id = ? AND status = ?', [
          venueId,
          1,
        ]),
        queryRunner.query('SELECT * FROM movies WHERE id = ? AND status = ?', [
          movieId,
          1,
        ]),
        queryRunner.query('SELECT * FROM tickets WHERE id = ? AND status = ?', [
          ticketId,
          1,
        ]),
      ]);

      // const [booking, user, seat, venue, movie, ticket] = await Promise.all([
      //   bookingQuery.getOne(),
      //   this.userRepository.findOneBy({ id: userId, status: 1 }),
      //   this.seatRepository.findOneBy({ id: seatId, status: 1 }),
      //   this.venueRepository.findOneBy({ id: venueId, status: 1 }),
      //   this.movieRepository.findOneBy({ id: movieId, status: 1 }),
      //   this.ticketRepository.findOneBy({ id: ticketId, status: 1 }),
      // ]);
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      if (booking.status !== 1) {
        throw new ConflictException(
          `Cannot edit a booking that is either cancelled, failed or expired`,
        );
      }
      if (
        !user?.length ||
        !seats?.length ||
        !venue?.length ||
        !movie?.length ||
        !ticket?.length
      ) {
        throw new NotFoundException('One or more related entities not found');
      }
      // if (seats[0].isReserved) {
      //   throw new ConflictException('Seat is already reserved');
      // }
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
      // booking.seat.isReserved = false;
      booking.seats.forEach((seat) => {
        seat.isReserved = false;
      });
      // await this.bookingRepository.save(booking);
      await queryRunner.manager.save(booking);
      // seats[0].isReserved = true;
      seats.forEach((seat) => {
        seat.isReserved = true;
      });
      booking.user = user[0];
      booking.seats = seats;
      booking.venue = venue[0];
      booking.movie = movie[0];
      booking.ticket = ticket[0];

      // const savedBooking = await this.bookingRepository.save(booking);
      const savedBooking = await queryRunner.manager.save(booking);
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
