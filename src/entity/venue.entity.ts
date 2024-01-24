// venue.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { EventEntity } from './event.entity';
import { MovieEntity } from './movie.entity';
import { SeatEntity } from './seat.entity';
import { TicketEntity } from './ticket.entity';

@Entity('venues')
export class VenueEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => EventEntity, (event) => event.venue, { cascade: ['insert'] })
  events: EventEntity[];

  @ManyToMany(() => MovieEntity, { cascade: ['insert']})
  @JoinTable({ name: 'movie_venue_mappings' })
  movies: MovieEntity[];

  @OneToMany(() => SeatEntity, (seat) => seat.venue, { cascade: true })
  seats: SeatEntity[];
  
  @OneToMany(() => TicketEntity, (ticket) => ticket.venue, { cascade: true })
  tickets: TicketEntity[];
}
