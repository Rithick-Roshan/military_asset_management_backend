const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchase.controller');

router.post('/create', purchaseController.createPurchase);
router.get('/getall', purchaseController.getPurchase);
router.post('/checkassetandbase', purchaseController.CheckAssetAndBase);

module.exports = router;