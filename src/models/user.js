const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize')

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
  }
}, {
  // Other model options go here
});

module.exports = User