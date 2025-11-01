import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users', { schema: 'auth' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'citext', unique: true })
  email: string;

  @Column({ nullable: true })
  password_hash: string;

  @Column()
  status: string;

  @Column()
  name: string;

  @Column()
  is_email_verified: boolean;

  @Column({ default: 'user' })
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @UpdateDateColumn()
  last_login_at: Date;
}
