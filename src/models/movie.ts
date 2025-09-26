import { DataTypes } from 'sequelize';
import { ModelSchema } from '../types.js';

const movieSchema: ModelSchema = [
  'Movie',
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
    genre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    release: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'movies',
    timestamps: true
  }
];

export default movieSchema;