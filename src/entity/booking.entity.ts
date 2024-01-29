import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { SeatEntity } from './seat.entity';
import { VenueEntity } from './venue.entity';
import { MovieEntity } from './movie.entity';
import { TicketEntity } from './ticket.entity';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => SeatEntity, (seat) => seat.bookings, { onDelete: 'CASCADE', cascade: ['update'] })
  @JoinColumn({ name: 'seatId' })
  seat: SeatEntity;

  @ManyToOne(() => VenueEntity, (venue) => venue.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venueId' })
  venue: VenueEntity;

  @ManyToOne(() => MovieEntity, (movie) => movie.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie: MovieEntity;

  @ManyToOne(() => TicketEntity, (ticket) => ticket.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticketId' })
  ticket: TicketEntity;

  @Column({default: 1, comment: '0=Cancelled, 1=Booked, 2=Completed, Failed=3'})
  status: number;

  @CreateDateColumn()
  createdDate: Date

  @UpdateDateColumn()
  updatedDate: Date
}
