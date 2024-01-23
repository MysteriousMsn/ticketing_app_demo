// ticket.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BookingEntity } from './booking.entity';

@Entity('tickets')
export class TicketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seatNumber: string;

  @ManyToOne(() => BookingEntity, (booking) => booking.tickets, { cascade: ['insert'] })
  booking: BookingEntity;
}
