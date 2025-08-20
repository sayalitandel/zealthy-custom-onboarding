const { DataTypes } = require('sequelize');
const sequelize = require('../config/databaseConfig');

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, 
  unique: { msg: 'Email already in use' }, 
  allowNull: false, 
  validate: { isEmail: { msg: 'Invalid email address' } } },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  aboutMe: { type: DataTypes.TEXT },
  birthdate: { type: DataTypes.DATEONLY },
}, { tableName: 'users' });

module.exports = User;
