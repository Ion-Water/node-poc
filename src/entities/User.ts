import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

  constructor(user: User) {
    Object.assign(this, user);
  }
}
