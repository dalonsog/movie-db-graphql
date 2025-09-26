import { DataTypes } from 'sequelize';
import { ModelSchema } from '../types.js';

const directorSchema: ModelSchema = [
  'Director',
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'directors',
    timestamps: true
  }
];

export default directorSchema;