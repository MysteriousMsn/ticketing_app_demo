// booking.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: number,
  ): Promise<BookingEntity> {
    const { seatId, venueId, movieId, ticketId } = createBookingDto;
    const [user, seat, venue, movie, ticket] = await Promise.all([
      this.userRepository.findOneBy({ id: userId }),
      this.seatRepository.findOneBy({ id: seatId }),
      this.venueRepository.findOneBy({ id: venueId }),
      this.movieRepository.findOneBy({ id: movieId }),
      this.ticketRepository.findOneBy({ id: ticketId }),
    ]);
    if (!user || !seat || !venue || !movie || !ticket) {
      throw new NotFoundException('One or more related entities not found');
    }
    if (seat.isReserved) {
      throw new ConflictException('Seat is already reserved');
    }
    seat.isReserved = true;
    const newBooking = this.bookingRepository.create({
      user,
      seat,
      venue,
      movie,
      ticket,
    });
    const savedBooking = await this.bookingRepository.save(newBooking);
    return savedBooking;
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
      .innerJoinAndSelect('booking.seat', 'seat')
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
      .innerJoinAndSelect('booking.seat', 'seat')
      .innerJoinAndSelect('booking.venue', 'venue')
      .innerJoinAndSelect('booking.movie', 'movie')
      .innerJoinAndSelect('booking.ticket', 'ticket')
      .where('user.id =:userId', { userId })
      .getMany();
    return bookings;
  }

  async update(
    id: number,
    updateBookingDto: CreateBookingDto,
    userId: number,
  ): Promise<BookingEntity> {
    const { seatId, venueId, movieId, ticketId } = updateBookingDto;
    const [booking, user, seat, venue, movie, ticket] = await Promise.all([
      this.bookingRepository
        .createQueryBuilder('booking')
        .innerJoinAndSelect('booking.seat', 'seat')
        .where('booking.id = :id', { id })
        .getOne(),
      this.userRepository.findOneBy({ id: userId }),
      this.seatRepository.findOneBy({ id: seatId }),
      this.venueRepository.findOneBy({ id: venueId }),
      this.movieRepository.findOneBy({ id: movieId }),
      this.ticketRepository.findOneBy({ id: ticketId }),
    ]);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.status !== 1) {
      throw new ConflictException(
        `Cannot edit a booking that is either cancelled, failed or expired`,
      );
    }
    if (!user || !seat || !venue || !movie || !ticket) {
      throw new NotFoundException('One or more related entities not found');
    }
    if (seat.isReserved) {
      throw new ConflictException('Seat is already reserved');
    }

    booking.seat.isReserved = false;
    await this.bookingRepository.save(booking);
    seat.isReserved = true;

    booking.user = user;
    booking.seat = seat;
    booking.venue = venue;
    booking.movie = movie;
    booking.ticket = ticket;

    const savedBooking = await this.bookingRepository.save(booking);
    return savedBooking;
  }

  async cancel(bookingId: number, userId: number): Promise<BookingEntity> {
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoinAndSelect('booking.seat', 'seat')
      .innerJoinAndSelect('booking.user', 'user')
      .where('booking.id = :bookingId', { bookingId })
      .where('user.id = :userId', { userId })
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
    if (!booking?.seat?.isReserved) {
      throw new ConflictException('Seat is not reserved for you');
    }
    booking.seat.isReserved = false;
    booking.status = 0;

    const savedBooking = await this.bookingRepository.save(booking);
    return savedBooking;
  }

  async remove(id: number): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepository.remove(booking);
  }
}
