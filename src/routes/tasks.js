const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const Task = require('../models/task')(sequelize);

router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.create({ title, description, status });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const { validate: isUUID } = require('uuid');

router.get('/:id', async (req, res) => {
  try {
    if (!isUUID(req.params.id)) {
      return res.status(400).json({ error: 'Invalid UUID format' });
    }
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!isUUID(req.params.id)) {
      return res.status(400).json({ error: 'Invalid UUID format' });
    }
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.update(req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!isUUID(req.params.id)) {
      return res.status(400).json({ error: 'Invalid UUID format' });
    }
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const task = await Task.create({ title, description, status });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
