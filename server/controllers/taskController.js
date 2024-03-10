const ErrorResponse = require('../helpers/errorResponse');
const asyncHandler = require('../middleware/async');
const Task = require('../models/TaskModel');

// @desc    Get all tasks
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
  const tasks = await Task.find({ createdBy: req.user.id });

  res.status(200).json({
    success: true,
    data: tasks,
  });
});

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
exports.getTask = asyncHandler(async (req, res, next) => {
  console.log(req.params.taskId);
  const task = await Task.findOne({ _id: req.params.taskId, createdBy: req.user.id });

  if (!task) {
    return next(new ErrorResponse(`Task not found with id ${req.params.taskId}`, 404));
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});
// @desc    Create task
// @route   POST /api/v1/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  // Add createdBy field to the task data
  req.body.createdBy = req.user.id;

  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task,
  });
});

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.taskId);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id ${req.params.taskId}`, 404));
  }

  // Check if the user is the creator of the task
  if (task.createdBy.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to update this task`, 401));
  }

  // Update only the relevant fields, in this case, 'status'
  task.status = req.body.status;

  // Save the updated task
  await task.save();

  res.status(200).json({
    success: true,
    data: task,
  });
});


// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id ${req.params.taskId}`, 404));
  }

  // Check if the user is the creator of the task
  if (task.createdBy.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to delete this task`, 401));
  }

  await task.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
