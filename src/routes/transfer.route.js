const express = require('express');
const transferController = require('../controllers/transfer.controller');
const router = express.Router();


router.post('/create', transferController.createTransfer);
router.get('/getall', transferController.getTransfer);

module.exports = router;