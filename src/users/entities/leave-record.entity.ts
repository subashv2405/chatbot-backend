import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface LeaveRecordAttributes {
  id?: number;
  user_id: number;
  leave_type: string;
  total_days: number;
  used_days: number;
}

@Table({
  tableName: 'leave_records',
  timestamps: true,
})
export class LeaveRecord extends Model<LeaveRecordAttributes> {
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
    type: DataType.STRING,
    allowNull: false,
  })
  declare leave_type: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare total_days: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare used_days: number;
}
