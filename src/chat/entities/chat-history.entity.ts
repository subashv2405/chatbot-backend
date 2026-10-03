import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ChatHistoryAttributes {
  id?: number;
  user_id: number;
  question: string;
  answer: string;
  category: string;
}

@Table({
  tableName: 'chat_history',
  timestamps: true,
})
export class ChatHistory extends Model<ChatHistoryAttributes> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare user_id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare question: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare answer: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare category: string;
}
