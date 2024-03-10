// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateUser, authorizeUser } = require('../middleware/auth');

// Authenticate user for all task routes
router.use(authenticateUser);

// CRUD operations for tasks
router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:taskId', taskController.getTask);
router.put('/:taskId', authorizeUser, taskController.updateTask);
router.delete('/:taskId', authorizeUser, taskController.deleteTask);

module.exports = router;
