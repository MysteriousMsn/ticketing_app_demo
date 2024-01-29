// location.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { VenueEntity } from './venue.entity';

@Entity('locations')
export class LocationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => VenueEntity, (venue) => venue.location)
  venues: VenueEntity[];

  @Column({ default: 1, comment: '0=Inactive, 1=Active' })
  status: number;
}
