import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Participant } from 'src/participant/entities/participant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  data: string;

  @ManyToOne(() => Participant, (participant) => participant.messages, { eager: true })
  @JoinColumn({ name: 'createdBy' })
  createdBy: Participant;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
