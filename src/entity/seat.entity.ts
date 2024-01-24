// venue.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { VenueEntity } from './venue.entity';
import { TicketEntity } from './ticket.entity';

@Entity('seats')
export class SeatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seatNumber: string;

  @Column()
  row: string;

  @Column()
  column: string;

  @Column({ default: false })
  isReserved: boolean;

  @ManyToOne(() => VenueEntity, (venue) => venue.seats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venueId' })
  venue: VenueEntity;

  @OneToMany(() => TicketEntity, (ticket) => ticket.seat)
  tickets: TicketEntity[];
}