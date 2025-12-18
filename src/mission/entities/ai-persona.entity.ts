import { Column } from 'typeorm';

export class AiPersona {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  character: string;
}
