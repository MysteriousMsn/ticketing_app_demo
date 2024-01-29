import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { EventEntity } from './event.entity';
import { MovieEntity } from './movie.entity';
import { SeatEntity } from './seat.entity';
import { TicketEntity } from './ticket.entity';
import { BookingEntity } from './booking.entity';
import { LocationEntity } from './location.entity';

@Entity('venues')
export class VenueEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => LocationEntity, (location) => location.venues)
  location: LocationEntity;

  @OneToMany(() => EventEntity, (event) => event.venue, { cascade: ['insert'] })
  events: EventEntity[];

  @ManyToMany(() => MovieEntity, { cascade: ['insert'] })
  @JoinTable({ name: 'movie_venue_mappings' })
  movies: MovieEntity[];

  @OneToMany(() => SeatEntity, (seat) => seat.venue, { cascade: true })
  seats: SeatEntity[];

  @OneToMany(() => TicketEntity, (ticket) => ticket.venue, { cascade: true })
  tickets: TicketEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.venue)
  bookings: BookingEntity[];

  @Column({ default: 1, comment: '0=Inactive, 1=Active' })
  status: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
