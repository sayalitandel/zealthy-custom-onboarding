const { DataTypes } = require('sequelize');
const sequelize = require('../config/databaseConfig');

// stores which components show on page2/page3
const FlowConfig = sequelize.define('FlowConfig', {
  page2: { type: DataTypes.JSON, allowNull: false, defaultValue: ['aboutMe'] },
  page3: { type: DataTypes.JSON, allowNull: false, defaultValue: ['address'] },
}, { tableName: 'flow_config' });

module.exports = FlowConfig;
