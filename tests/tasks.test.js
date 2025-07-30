const request = require('supertest');
const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals');
const app = require('../src/app');
const sequelize = require('../src/config/database');
const Task = require('../src/models/task')(sequelize);

describe('Task API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'Test description',
          status: 'pending',
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Task');
      expect(response.body.description).toBe('Test description');
      expect(response.body.status).toBe('pending');
    });

    it('should fail if title is missing', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ description: 'No title' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /tasks', () => {
    it('should list all tasks', async () => {
      // Task from POST /tasks test will exist
      const response = await request(app).get('/tasks');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title', 'Test Task'); // Match POST test data
    });
  });

  describe('GET /tasks/:id', () => {
    it('should get a task by ID', async () => {
      const task = await Task.create({
        title: 'Task 2',
        description: 'Desc 2',
      });
      const response = await request(app).get(`/tasks/${task.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', task.id);
      expect(response.body.title).toBe('Task 2');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app).get(
        '/tasks/123e4567-e89b-12d3-a456-426614174000'
      );
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task', async () => {
      const task = await Task.create({
        title: 'Task 3',
        description: 'Desc 3',
      });
      const response = await request(app)
        .put(`/tasks/${task.id}`)
        .send({ title: 'Updated Task', status: 'completed' });
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Task');
      expect(response.body.status).toBe('completed');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/tasks/123e4567-e89b-12d3-a456-426614174000')
        .send({ title: 'Updated' });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await Task.create({
        title: 'Task 4',
        description: 'Desc 4',
      });
      const response = await request(app).delete(`/tasks/${task.id}`);
      expect(response.status).toBe(204);
      const found = await Task.findByPk(task.id);
      expect(found).toBeNull();
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app).delete(
        '/tasks/123e4567-e89b-12d3-a456-426614174000'
      );
      expect(response.status).toBe(404);
    });
  });
});
