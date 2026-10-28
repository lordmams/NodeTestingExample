// Tests d'intégration API Products

const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/database/memoryDB');

describe('API Products - Tests d\'Intégration', () => {
  
  beforeEach(() => {
    db.reset();
  });

  describe('POST /api/products - Création de produit', () => {
    test('doit créer un produit avec calcul automatique du prix TTC', async () => {
      const productData = {
        name: 'Ordinateur Portable',
        price: 1000,
        description: 'Un excellent ordinateur',
        stock: 10
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Ordinateur Portable');
      expect(response.body.price).toBe(1000);
      expect(response.body.prixTTC).toBe(1200); // 1000 + 20% TVA
      expect(response.body.stock).toBe(10);
    });

    test('doit retourner 400 pour un prix négatif', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({ name: 'Produit', price: -100 })
        .expect(400);

      expect(response.body.error).toContain('négatif');
    });

    test('doit retourner 400 si le nom est manquant', async () => {
      await request(app)
        .post('/api/products')
        .send({ price: 100 })
        .expect(400);
    });
  });

  describe('GET /api/products - Liste des produits', () => {
    test('doit retourner tous les produits', async () => {
      await request(app).post('/api/products').send({
        name: 'Produit A',
        price: 100
      });

      await request(app).post('/api/products').send({
        name: 'Produit B',
        price: 200
      });

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Produit A');
      expect(response.body[1].name).toBe('Produit B');
    });
  });

  describe('GET /api/products/:id - Récupération d\'un produit', () => {
    test('doit retourner un produit existant', async () => {
      const createResponse = await request(app).post('/api/products').send({
        name: 'Souris',
        price: 25
      });

      const productId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body.id).toBe(productId);
      expect(response.body.name).toBe('Souris');
    });

    test('doit retourner 404 pour un produit inexistant', async () => {
      await request(app)
        .get('/api/products/999')
        .expect(404);
    });
  });

  describe('PUT /api/products/:id - Mise à jour d\'un produit', () => {
    test('doit mettre à jour le prix et recalculer le TTC', async () => {
      const createResponse = await request(app).post('/api/products').send({
        name: 'Clavier',
        price: 50
      });

      const productId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send({ price: 75 })
        .expect(200);

      expect(response.body.price).toBe(75);
      expect(response.body.prixTTC).toBe(90); // 75 + 20%
    });

    test('doit mettre à jour le stock', async () => {
      const createResponse = await request(app).post('/api/products').send({
        name: 'Écran',
        price: 300,
        stock: 5
      });

      const productId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send({ stock: 8 })
        .expect(200);

      expect(response.body.stock).toBe(8);
    });
  });

  describe('POST /api/products/:id/discount - Application d\'une remise', () => {
    test('doit appliquer une remise de 10%', async () => {
      const createResponse = await request(app).post('/api/products').send({
        name: 'Tablette',
        price: 500
      });

      const productId = createResponse.body.id;

      const response = await request(app)
        .post(`/api/products/${productId}/discount`)
        .send({ discount: 10 })
        .expect(200);

      expect(response.body.price).toBe(450); // 500 - 10%
      expect(response.body.prixTTC).toBe(540); // 450 + 20%
    });

    test('doit retourner 400 pour une remise invalide', async () => {
      const createResponse = await request(app).post('/api/products').send({
        name: 'Smartphone',
        price: 800
      });

      const productId = createResponse.body.id;

      await request(app)
        .post(`/api/products/${productId}/discount`)
        .send({ discount: 150 }) // > 100%
        .expect(400);
    });
  });

  describe('DELETE /api/products/:id - Suppression d\'un produit', () => {
    test('doit supprimer un produit existant', async () => {
      const createResponse = await request(app).post('/api/products').send({
        name: 'Casque',
        price: 100
      });

      const productId = createResponse.body.id;

      await request(app)
        .delete(`/api/products/${productId}`)
        .expect(200);

      await request(app)
        .get(`/api/products/${productId}`)
        .expect(404);
    });
  });
});
