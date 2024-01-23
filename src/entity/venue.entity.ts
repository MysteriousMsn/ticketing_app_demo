// venue.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EventEntity } from './event.entity';

@Entity('venues')
export class VenueEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => EventEntity, (event) => event.venue, { cascade: ['insert'] })
  events: EventEntity[];
}
