// booking.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createBookingDto: CreateBookingDto): Promise<BookingEntity> {
    const { userId, seatId, venueId, movieId, ticketId } = createBookingDto;

    const [user, seat, venue, movie, ticket] = await Promise.all([
        this.userRepository.findOneBy({id: userId}),
        this.seatRepository.findOneBy({id: seatId}),
        this.venueRepository.findOneBy({id: venueId}),
        this.movieRepository.findOneBy({id: movieId}),
        this.ticketRepository.findOneBy({id: ticketId})
    ]);
    if (!user || !seat || !venue || !movie || !ticket) {
      throw new NotFoundException('One or more related entities not found');
    }
    
    if (seat.isReserved) {
      throw new ConflictException('Seat is already reserved');
    }
    const newBooking = this.bookingRepository.create({
      user,
      seat,
      venue,
      movie,
      ticket,
    });
  
    const savedBooking = await this.bookingRepository.save(newBooking);

    seat.isReserved = true;
    await this.seatRepository.save(seat);

    return savedBooking;
  }

  async findOne(id: number): Promise<BookingEntity> {
    const booking = await this.bookingRepository.findOneBy({id});
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async findAll(): Promise<BookingEntity[]> {
    return this.bookingRepository.find();
  }

  async update(id: number, updateBookingDto: CreateBookingDto): Promise<BookingEntity> {
    const booking = await this.findOne(id);
    return this.bookingRepository.save({ ...booking, ...updateBookingDto });
  }

  async remove(id: number): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepository.remove(booking);
  }
}