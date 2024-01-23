// movie.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('movies')
export class MovieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
