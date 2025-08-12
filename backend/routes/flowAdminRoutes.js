const express = require('express');
const { getFlowConfig, updateFlowConfig } = require('../controllers/flowController');
const { requireAdmin } = require('../middleware/authz');

const router = express.Router();

router.use(requireAdmin);

router.get('/config', getFlowConfig);
router.put('/config', updateFlowConfig);

module.exports = router;