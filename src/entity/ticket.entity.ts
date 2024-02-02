import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { VenueEntity } from './venue.entity';
import { SeatEntity } from './seat.entity';
import { BookingEntity } from './booking.entity';

@Entity('tickets')
export class TicketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // @ManyToOne(() => SeatEntity, (seat) => seat.tickets, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'seatId', referencedColumnName: 'id' })
  // seat: SeatEntity;

  @OneToMany(() => SeatEntity, (seat) => seat.ticket)
  seats: SeatEntity[];

  @Column({ type: 'float' })
  price: number;

  @ManyToOne(() => VenueEntity, (venue) => venue.tickets, {
    onDelete: 'CASCADE',
  })
  venue: VenueEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  priceUpdatedAt: Date;

  // @OneToMany(() => BookingEntity, (booking) => booking.ticket, {
  //   onDelete: 'CASCADE',
  // })
  // bookings: BookingEntity[];

  @ManyToMany(() => BookingEntity, (booking) => booking.tickets, {
    cascade: ['insert', 'update', 'remove'],
  })
  bookings: BookingEntity[];

  @Column({ default: 1, comment: '0=Inactive, 1=Active' })
  status: number;
}
