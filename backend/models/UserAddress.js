const { DataTypes } = require('sequelize');
const sequelize = require('../config/databaseConfig');
const User = require('./User');

const UserAddress = sequelize.define('UserAddress', {
  street: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  zip: DataTypes.STRING,
}, { tableName: 'user_addresses' });

User.hasOne(UserAddress, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserAddress.belongsTo(User, { foreignKey: 'userId' });

module.exports = UserAddress;
