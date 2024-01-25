import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { RoleEntity } from './role.entity';
import { BookingEntity } from './booking.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false
  })
  name: string;
  
  @Column({
    nullable: false
  })
  email: string;

  @Column({
    nullable: false
  })
  password: string;

  @ManyToMany(() => RoleEntity, { cascade: ['insert'] })
  @JoinTable({name: 'user_role_mappings'})
  roles: RoleEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.user, { cascade: ['insert'] })
  bookings: BookingEntity[];

  @CreateDateColumn()
  createdDate: Date

  @UpdateDateColumn()
  updatedDate: Date
}