import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';
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

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
