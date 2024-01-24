import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { VenueEntity } from './venue.entity';
import { SeatEntity } from './seat.entity';

@Entity('tickets')
export class TicketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => SeatEntity, (seat) => seat.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seatId', referencedColumnName: 'id' })
  seat: SeatEntity;

  @Column({ type: 'float' })
  price: number;

  @ManyToOne(() => VenueEntity, (venue) => venue.tickets, { onDelete: 'CASCADE' })
  venue: VenueEntity;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  priceUpdatedAt: Date;
}
