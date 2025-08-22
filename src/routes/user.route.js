const express = require('express');
const router = express.Router();
const authController = require('../controllers/user.controller');

router.post('/register',authController.createUser);
router.post('/login', authController.login);
router.post('/createbase', authController.createBase);
router.get('/getbases', authController.getBases);
router.get('/getusers', authController.getUsers);
router.put('updatebase', authController.updateBase);
router.delete('/deletebase',authController.deleteBase);
router.put('/updateuser', authController.updateUser);
router.delete('/deleteuser', authController.deleteUser);

module.exports = router;