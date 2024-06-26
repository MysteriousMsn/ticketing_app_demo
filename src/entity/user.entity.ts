import * as bcrypt from 'bcrypt';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { BookingEntity } from './booking.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @ManyToMany(() => RoleEntity, { cascade: ['insert'] })
  @JoinTable({ name: 'user_role_mappings' })
  roles: RoleEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.user, {
    cascade: ['insert'],
  })
  bookings: BookingEntity[];

  @Column({ default: 1, comment: '0=Inactive, 1=Active' })
  status: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async compareHash(plainTextPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, this.password);
  }
}
