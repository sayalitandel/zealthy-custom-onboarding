const { DataTypes } = require('sequelize');
const sequelize = require('../config/databaseConfig');

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  aboutMe: { type: DataTypes.TEXT },
  birthdate: { type: DataTypes.DATEONLY },
}, { tableName: 'users' });

module.exports = User;
