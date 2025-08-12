const express = require('express');
const { beginRegistration, updateOnboardingStep } = require('../controllers/flowController');

const router = express.Router();

router.post('/register', beginRegistration);

router.patch('/:userId', updateOnboardingStep);

module.exports = router;