import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './User';

export interface MailboxMessage {
  id: string;
  target_user: UserEntity;
  content_id: string;
  content: unknown;
  server_id: string | null;
  mailbox_location: string;
  message_type: string;
  message_source: string;
  sent_timestamp: string;
  read_timestamp: string | null;
  arrived_timestamp: string;
}

@Entity({ name: 'mailbox_message' })
export class MailboxMessageEntity implements MailboxMessage {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id!: string;

  @Column({ name: 'content_id', type: 'uuid' })
  content_id!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  target_user!: UserEntity;

  @Column({ name: 'content', type: 'jsonb' })
  content!: unknown;

  @Column({ name: 'server_id', type: 'text', nullable: true })
  server_id!: string | null;

  @Column({ name: 'message_type', type: 'text' })
  message_type!: string;

  @Column({ name: 'message_source', type: 'text' })
  message_source!: string;

  @Index('mailbox_message_location_index')
  @Column({ name: 'mailbox_location', type: 'text' })
  mailbox_location!: string;

  @Column({ name: 'sent_timestamp', type: 'timestamptz' })
  sent_timestamp!: string;

  @Column({ name: 'read_timestamp', type: 'timestamptz', nullable: true })
  read_timestamp!: string | null;

  @Index('mailbox_message_arrived_index')
  @CreateDateColumn({ name: 'arrived_timestamp', type: 'timestamptz' })
  arrived_timestamp!: string;

  constructor(session: MailboxMessage) {
    Object.assign(this, session);
  }
}
