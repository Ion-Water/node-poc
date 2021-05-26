import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './User';
import { v4 as uuid } from 'uuid';
import { formatISO } from 'date-fns';

const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

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
  user!: UserEntity;

  @Column({ name: 'access_token', type: 'text' })
  access_token!: string;

  @Column({ name: 'refresh_token', type: 'text' })
  refresh_token!: string;

  @Column({ name: 'created_at', type: 'timestamptz' })
  created_at!: string;

  @Column({ name: 'valid_for', type: 'int' })
  valid_for!: number;

  constructor(session: Session) {
    Object.assign(this, session);
  }
}

export function newSession(valid_for = ONE_DAY_IN_MILLISECONDS): Session {
  return {
    id: uuid(),
    access_token: uuid(),
    refresh_token: uuid(),
    created_at: formatISO(new Date()),
    valid_for,
  };
}
