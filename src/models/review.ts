import { DataTypes } from 'sequelize';
import { ModelSchema } from '../types.js';

const reviewSchema: ModelSchema = [
  'Review',
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'reviews',
    timestamps: true
  }
];

export default reviewSchema;