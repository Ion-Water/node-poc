import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

export interface TransientMessage {
  id: string;
  content: unknown;
  message_target: string;
  message_source: string;
  sent_timestamp: string;
  arrived_timestamp: string;
}

@Entity({ name: 'transient_message' })
export class TransientMessageEntity implements TransientMessage {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id!: string;

  @Column({ name: 'content', type: 'jsonb' })
  content!: unknown;

  @Column({ name: 'message_target', type: 'text' })
  message_target!: string;

  @Column({ name: 'message_source', type: 'text' })
  message_source!: string;

  @Column({ name: 'sent_timestamp', type: 'timestamptz' })
  sent_timestamp!: string;

  @Index('transient_message_arrived_index')
  @CreateDateColumn({ name: 'arrived_timestamp', type: 'timestamptz' })
  arrived_timestamp!: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expires_at!: Date;

  constructor(message: TransientMessage) {
    Object.assign(this, message);
  }
}
