// event.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { VenueEntity } from './venue.entity';
import { BookingEntity } from './booking.entity';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => VenueEntity, (venue) => venue.events)
  venue: VenueEntity;

  @OneToMany(() => BookingEntity, (booking) => booking.event,  { cascade: ['insert'] })
  bookings: BookingEntity[];
}
