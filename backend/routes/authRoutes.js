const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', (req, res) => {
  const { userName, userPassword } = req.body;
  if (!userName || !userPassword) return res.status(400).json({ message: 'Missing credentials' });
  const token = jwt.sign({ sub: userName, role: 'admin' }, process.env.JWT_SECRET || 'dev', { expiresIn: '2h' });
  res.json({ token });
});

module.exports = router;