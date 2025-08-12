// change this version
let flowConfig = {
  page2: ['aboutMe'],   // components
  page3: ['address']
};

// POST /api/user-flow/register
exports.beginRegistration = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email & password required' });

  // TODO: save user to DB (hash password), return userId
  const mockUserId = Math.floor(Math.random() * 1000000);
  res.status(201).json({ userId: mockUserId });
};

// PATCH /api/user-flow/:userId
exports.updateOnboardingStep = async (req, res) => {
  const { userId } = req.params;
  const { aboutMe, birthdate, address } = req.body || {};
  // TODO: persist these to DB (User + UserAddress)
  res.json({ ok: true, userId, saved: { aboutMe, birthdate, address } });
};

// GET /api/flow-admin/config
exports.getFlowConfig = async (_req, res) => {
  res.json(flowConfig);
};

// PUT /api/flow-admin/config
exports.updateFlowConfig = async (req, res) => {
  const { page2, page3 } = req.body || {};
  const allowed = new Set(['aboutMe', 'address', 'birthdate']);
  if (!Array.isArray(page2) || !page2.length || !Array.isArray(page3) || !page3.length)
    return res.status(400).json({ message: 'page2/page3 must be non-empty arrays' });
  if (![...page2, ...page3].every(c => allowed.has(c)))
    return res.status(400).json({ message: 'invalid component name' });

  flowConfig = { page2, page3 };
  res.json({ ok: true, flowConfig });
};
