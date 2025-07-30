const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/database');
const Task = require('../src/models/task')(sequelize);

describe('Task API', () => {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connection established');
      await sequelize.sync({ force: true });
      console.log('Database synced');
    } catch (error) {
      console.error('Error in beforeAll:', error);
      throw error;
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Database Config Coverage', () => {
    it('should use fallback env vars', () => {
      const seq = require('../src/config/database');
      expect(seq.options.host).toBe('localhost');
      expect(seq.options.port).toBe('5432');
    });
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
  });

  describe('GET /tasks', () => {
    it('should list all tasks', async () => {
      await Task.create({ title: 'Task 1', description: 'Desc 1' });
      const response = await request(app).get('/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[response.body.length - 1]).toHaveProperty(
        'title',
        'Task 1'
      );
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

    it('should return 400 for invalid UUID format', async () => {
      const response = await request(app).get('/tasks/invalid-id');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid UUID format');
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

    it('should return 400 for invalid UUID format', async () => {
      const response = await request(app)
        .put('/tasks/invalid-id')
        .send({ title: 'Updated' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid UUID format');
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

    it('should return 400 for invalid UUID format', async () => {
      const response = await request(app).delete('/tasks/invalid-id');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid UUID format');
    });
  });
});
