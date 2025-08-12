const User = require('../models/User');
const UserAddress = require('../models/UserAddress');

exports.listUsers = async (_req, res) => {
  const rows = await User.findAll({ include: [{ model: UserAddress, required: false }] });
  res.json(rows);
};