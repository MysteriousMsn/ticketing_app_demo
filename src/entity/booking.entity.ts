import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
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

  @ManyToMany(() => SeatEntity, (seat) => seat.bookings, {
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinTable({ name: 'booking_seat_mappings' })
  seats: SeatEntity[];

  @ManyToOne(() => VenueEntity, (venue) => venue.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'venueId' })
  venue: VenueEntity;

  @ManyToOne(() => MovieEntity, (movie) => movie.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movieId' })
  movie: MovieEntity;

  // @ManyToOne(() => TicketEntity, (ticket) => ticket.bookings, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'ticketId' })
  // ticket: TicketEntity;

  @ManyToMany(() => TicketEntity, (ticket) => ticket.bookings)
  @JoinTable({ name: 'booking_ticket_mappings' })
  tickets: TicketEntity[];

  @Column()
  totalSeats: number;

  @Column()
  amount: number;

  @Column({
    default: 1,
    comment: '0=cancelled, 1=in_process, 2=paid, 3=completed, 4=failed',
  })
  status: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
