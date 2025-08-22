const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset.controller');

router.post('/create',assetController.createAsset );
router.get('/getall', assetController.getAssets);
router.get("/getassetid", assetController.getAssetId);
router.get('/getassetbyid', assetController.getAssetById);
router.put('/updateasseet',assetController.updateAsset);
router.put("/updateassetforassignment",assetController.updateAssetForAssigment);

module.exports = router;