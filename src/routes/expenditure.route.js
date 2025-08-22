const express = require('express');
const router = express.Router();
const expenditureController = require('../controllers/expenditure.controller');

router.post('/create', expenditureController.createExpenditure);
router.get('/getall', expenditureController.getExpenditures);

module.exports = router;