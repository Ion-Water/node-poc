import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SessionEntity } from './Session';
interface User {
  id?: number;
  username: string;
  password: string;
}

@Entity({ name: 'user' })
export class UserEntity implements User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id?: number;

  @Column({ name: 'username', type: 'text' })
  username!: string;

  @Column({ name: 'password', type: 'text' })
  password!: string;

  @OneToMany(() => SessionEntity, (s) => s.user)
  sessions!: SessionEntity[];

  constructor(user: User) {
    Object.assign(this, user);
  }
}
