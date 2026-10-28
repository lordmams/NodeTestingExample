// Tests d'intégration API Users

const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/database/memoryDB');

describe('API Users - Tests d\'Intégration', () => {
  
  beforeEach(() => {
    db.reset();
  });

  describe('POST /api/users - Création d\'utilisateur', () => {
    test('doit créer un utilisateur avec des données valides', async () => {
      const userData = {
        name: 'Alice Dupont',
        email: 'alice@example.com',
        password: 'SecurePass123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect('Content-Type', /json/);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Alice Dupont');
      expect(response.body.email).toBe('alice@example.com');
      expect(response.body).not.toHaveProperty('password');
    });

    test('doit retourner 400 pour un email invalide', async () => {
      const userData = {
        name: 'Bob',
        email: 'email-invalide',
        password: 'SecurePass123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('invalide');
    });

    test('doit retourner 400 pour un mot de passe faible', async () => {
      const userData = {
        name: 'Charlie',
        email: 'charlie@example.com',
        password: 'weak'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('doit retourner 400 si l\'email existe déjà', async () => {
      const userData = {
        name: 'David',
        email: 'david@example.com',
        password: 'SecurePass123'
      };

      await request(app).post('/api/users').send(userData);

      const response = await request(app).post('/api/users').send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toContain('existe déjà');
    });

    test('doit retourner 400 si des champs sont manquants', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Eve' }); // email et password manquants

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/users - Liste des utilisateurs', () => {
    test('doit retourner une liste vide initialement', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    test('doit retourner tous les utilisateurs', async () => {
      await request(app).post('/api/users').send({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'SecurePass123'
      });

      await request(app).post('/api/users').send({
        name: 'Bob',
        email: 'bob@example.com',
        password: 'SecurePass123'
      });

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Alice');
      expect(response.body[1].name).toBe('Bob');
      expect(response.body[0]).not.toHaveProperty('password');
      expect(response.body[1]).not.toHaveProperty('password');
    });
  });

  describe('GET /api/users/:id - Récupération d\'un utilisateur', () => {
    test('doit retourner un utilisateur existant', async () => {
      const createResponse = await request(app).post('/api/users').send({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'SecurePass123'
      });

      const userId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.name).toBe('Alice');
      expect(response.body).not.toHaveProperty('password');
    });

    test('doit retourner 404 pour un utilisateur inexistant', async () => {
      const response = await request(app)
        .get('/api/users/999')
        .expect(404);

      expect(response.body.error).toContain('introuvable');
    });

    test('doit retourner 400 pour un ID invalide', async () => {
      const response = await request(app)
        .get('/api/users/invalid');

      // NaN après parseInt
      expect([400, 404]).toContain(response.statusCode);
    });
  });

  describe('PUT /api/users/:id - Mise à jour d\'un utilisateur', () => {
    test('doit mettre à jour le nom d\'un utilisateur', async () => {
      const createResponse = await request(app).post('/api/users').send({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'SecurePass123'
      });

      const userId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send({ name: 'Alice Updated' })
        .expect(200);

      expect(response.body.name).toBe('Alice Updated');
      expect(response.body.email).toBe('alice@example.com'); // email inchangé
    });

    test('ne doit pas permettre de changer l\'email', async () => {
      const createResponse = await request(app).post('/api/users').send({
        name: 'Bob',
        email: 'bob@example.com',
        password: 'SecurePass123'
      });

      const userId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send({ email: 'newemail@example.com' })
        .expect(200);

      expect(response.body.email).toBe('bob@example.com');
    });

    test('doit retourner 404 pour un utilisateur inexistant', async () => {
      await request(app)
        .put('/api/users/999')
        .send({ name: 'New Name' })
        .expect(404);
    });
  });

  describe('DELETE /api/users/:id - Suppression d\'un utilisateur', () => {
    test('doit supprimer un utilisateur existant', async () => {
      const createResponse = await request(app).post('/api/users').send({
        name: 'Charlie',
        email: 'charlie@example.com',
        password: 'SecurePass123'
      });

      const userId = createResponse.body.id;

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.message).toContain('supprimé');

      await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);
    });

    test('doit retourner 404 pour un utilisateur inexistant', async () => {
      await request(app)
        .delete('/api/users/999')
        .expect(404);
    });
  });
});
