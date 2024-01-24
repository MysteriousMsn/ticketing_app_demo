// movie.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { VenueEntity } from './venue.entity';

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
  @JoinTable({name: 'movie_venue_mappings'})
  venues: VenueEntity[];
}
