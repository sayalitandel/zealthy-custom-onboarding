const express = require('express');
const { getFlowConfig, updateFlowConfig } = require('../controllers/flowController');

const router = express.Router();

router.get('/config', getFlowConfig);
router.put('/config', updateFlowConfig);

module.exports = router;