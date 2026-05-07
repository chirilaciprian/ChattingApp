import { Message } from 'src/message/entities/message.entity';
import { Participant } from 'src/participant/entities/participant.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Participant, (participant) => participant.conversation)
  @JoinTable()
  participants: Participant[];

  @OneToMany(() => Message, (message) => message.conversation, {
    cascade: true,
  })
  messages?: Message[];

  @Column({ default: false })
  isGroup: boolean;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
