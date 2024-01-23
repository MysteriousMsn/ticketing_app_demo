// booking.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { EventEntity } from './event.entity';
import { TicketEntity } from './ticket.entity';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.bookings, { cascade: ['insert'] })
  user: UserEntity;

  @ManyToOne(() => EventEntity, (event) => event.bookings, { cascade: ['insert'] })
  event: EventEntity;

  @OneToMany(() => TicketEntity, (ticket) => ticket.booking, { cascade: ['insert'] })
  tickets: TicketEntity[];
}
