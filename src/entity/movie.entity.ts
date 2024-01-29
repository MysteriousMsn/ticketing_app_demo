// movie.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { VenueEntity } from './venue.entity';
import { BookingEntity } from './booking.entity';

@Entity('movies')
export class MovieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  releaseDate: Date;

  @ManyToMany(() => VenueEntity, { cascade: ['insert'] })
  @JoinTable({ name: 'movie_venue_mappings' })
  venues: VenueEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.movie)
  bookings: BookingEntity[];

  @Column({ default: 1, comment: '0=Inactive, 1=Active' })
  status: number;
}
