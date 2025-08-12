const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserAddress = require('../models/UserAddress');
const FlowConfig = require('../models/FlowConfig');

// ensure 1 row exists for config
async function ensureConfig() {
  const row = await FlowConfig.findOne();
  if (row) return row;
  return FlowConfig.create({ page2: ['aboutMe'], page3: ['address'] });
}

// POST /api/user-flow/register  { email, password }
exports.beginRegistration = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email & password required' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });

    res.status(201).json({ userId: user.id });
  } catch (e) {
    res.status(400).json({ message: 'Register failed', error: e.message });
  }
};

// PATCH /api/user-flow/:userId  { aboutMe?, birthdate?, address? }
exports.updateOnboardingStep = async (req, res) => {
  try {
    const { userId } = req.params;
    const { aboutMe, birthdate, address } = req.body || {};

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (aboutMe !== undefined) user.aboutMe = aboutMe;
    if (birthdate !== undefined) user.birthdate = birthdate;
    await user.save();

    if (address) {
      const { street, city, state, zip } = address;
      let ua = await UserAddress.findOne({ where: { userId } });
      if (!ua) ua = await UserAddress.create({ userId, street, city, state, zip });
      else await ua.update({ street, city, state, zip });
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ message: 'Update failed', error: e.message });
  }
};

// GET /api/flow-admin/config
exports.getFlowConfig = async (_req, res) => {
  const cfg = await ensureConfig();
  res.json({ page2: cfg.page2, page3: cfg.page3 });
};

// PUT /api/flow-admin/config  { page2:[], page3:[] }
exports.updateFlowConfig = async (req, res) => {
  const { page2, page3 } = req.body || {};
  const allowed = new Set(['aboutMe', 'address', 'birthdate']);
  if (!Array.isArray(page2) || !page2.length || !Array.isArray(page3) || !page3.length)
    return res.status(400).json({ message: 'page2/page3 must be non-empty arrays' });
  if (![...page2, ...page3].every(c => allowed.has(c)))
    return res.status(400).json({ message: 'invalid component name' });

  const cfg = await ensureConfig();
  cfg.page2 = page2; cfg.page3 = page3;
  await cfg.save();
  res.json({ ok: true });
};