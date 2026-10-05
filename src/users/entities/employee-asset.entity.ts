import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface EmployeeAssetAttributes {
  id?: number;
  user_id: number;
  asset_name: string;
  asset_type: string;
  assigned_date: Date;
  status: string;
}

@Table({
  tableName: 'employee_assets',
  timestamps: true,
})
export class EmployeeAsset extends Model<EmployeeAssetAttributes> {
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
  declare asset_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare asset_type: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare assigned_date: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare status: string;
}
