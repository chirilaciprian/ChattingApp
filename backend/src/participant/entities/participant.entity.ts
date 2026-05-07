import { Conversation } from "src/conversation/entities/conversation.entity";
import { Message } from "src/message/entities/message.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Participant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Conversation, (c) => c.participants)
    @JoinColumn({ name: 'conversationId' })
    conversation: Conversation;

    @OneToMany(() => Message, (message) => message.createdBy, { cascade: true })
    messages?: Message[];

    @Column({ type: 'timestamp', nullable: true })
    lastReadAt?: Date;

    @Column({ default: 0 })
    unreadCount: number;

    @Column({ default: 'member' })
    role: 'admin' | 'member';

    @Column({ default: false })
    isMuted: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    joinedAt: Date;
}
