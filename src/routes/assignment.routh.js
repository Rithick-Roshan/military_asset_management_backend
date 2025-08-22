const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignment.controller');

router.post('/create', assignmentController.createAssignment);
router.get('/getall', assignmentController.getAssignments);

module.exports = router;