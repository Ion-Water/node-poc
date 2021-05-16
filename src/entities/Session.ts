import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './User';

export interface Session {
  id: string;
  access_token: string;
  refresh_token: string;
  created_at: string;
  valid_for: number;
}
@Entity({ name: 'session' })
export class SessionEntity implements Session {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user_id!: UserEntity;

  @Column({ name: 'access_token', type: 'text' })
  access_token!: string;

  @Column({ name: 'refresh_token', type: 'text' })
  refresh_token!: string;

  @Column({ name: 'created_at', type: 'timestamptz' })
  created_at!: string;

  @Column({ name: 'valid_for', type: 'int' })
  valid_for!: number;
}
