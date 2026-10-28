// Tests E2E - parcours utilisateur

const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/database/memoryDB');

describe('E2E - Parcours utilisateur complet', () => {
  
  beforeEach(() => {
    db.reset();
  });

  test('Parcours complet : inscription → création produits → gestion', async () => {
    // health check
    const healthCheck = await request(app)
      .get('/health')
      .expect(200);
    
    expect(healthCheck.body.status).toBe('OK');

    // créer un user
    const newUser = {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      password: 'SecurePass123',
      age: 30
    };

    const userResponse = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201);

    expect(userResponse.body).toHaveProperty('id');
    expect(userResponse.body.email).toBe(newUser.email);
    const userId = userResponse.body.id;

    // vérifier qu'il est bien créé
    const getUserResponse = await request(app)
      .get(`/api/users/${userId}`)
      .expect(200);

    expect(getUserResponse.body.name).toBe('Jean Dupont');

    // créer un premier produit
    const product1 = {
      name: 'Ordinateur Portable',
      price: 1000,
      description: 'MacBook Pro 14"',
      stock: 5
    };

    const createProduct1Response = await request(app)
      .post('/api/products')
      .send(product1)
      .expect(201);

    const product1Id = createProduct1Response.body.id;
    expect(createProduct1Response.body.prixTTC).toBe(1200); // 1000 + 20%

    // second produit
    const product2 = {
      name: 'Souris sans fil',
      price: 50,
      stock: 20
    };

    const createProduct2Response = await request(app)
      .post('/api/products')
      .send(product2)
      .expect(201);

    const product2Id = createProduct2Response.body.id;

    // lister les produits
    const allProductsResponse = await request(app)
      .get('/api/products')
      .expect(200);

    expect(allProductsResponse.body).toHaveLength(2);

    // remise sur le premier
    const discountResponse = await request(app)
      .post(`/api/products/${product1Id}/discount`)
      .send({ discount: 20 })
      .expect(200);

    expect(discountResponse.body.price).toBe(800); // 1000 - 20%
    expect(discountResponse.body.prixTTC).toBe(960); // 800 + 20% TVA

    // maj stock du second
    const updateStockResponse = await request(app)
      .put(`/api/products/${product2Id}`)
      .send({ stock: 15 })
      .expect(200);

    expect(updateStockResponse.body.stock).toBe(15);

    // maj profil user
    const updateUserResponse = await request(app)
      .put(`/api/users/${userId}`)
      .send({ name: 'Jean Dupont - CEO' })
      .expect(200);

    expect(updateUserResponse.body.name).toBe('Jean Dupont - CEO');

    // check final
    const finalUserCheck = await request(app)
      .get(`/api/users/${userId}`)
      .expect(200);

    expect(finalUserCheck.body.name).toBe('Jean Dupont - CEO');

    const finalProductsCheck = await request(app)
      .get('/api/products')
      .expect(200);

    expect(finalProductsCheck.body).toHaveLength(2);
    
    const updatedProduct1 = finalProductsCheck.body.find(p => p.id === product1Id);
    expect(updatedProduct1.price).toBe(800);
    
    const updatedProduct2 = finalProductsCheck.body.find(p => p.id === product2Id);
    expect(updatedProduct2.stock).toBe(15);

    // supprimer un produit
    await request(app)
      .delete(`/api/products/${product2Id}`)
      .expect(200);

    const finalCheckAfterDelete = await request(app)
      .get('/api/products')
      .expect(200);

    expect(finalCheckAfterDelete.body).toHaveLength(1);
  });

  test('Parcours d\'erreur : tentatives invalides', async () => {
    // email invalide
    await request(app)
      .post('/api/users')
      .send({
        name: 'User',
        email: 'invalid-email',
        password: 'Password123'
      })
      .expect(400);

    // user inexistant
    await request(app)
      .get('/api/users/999')
      .expect(404);

    // user valide
    await request(app)
      .post('/api/users')
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'SecurePass123'
      })
      .expect(201);

    // même email une 2e fois
    await request(app)
      .post('/api/users')
      .send({
        name: 'Bob',
        email: 'alice@example.com',
        password: 'SecurePass123'
      })
      .expect(400);

    // prix négatif
    await request(app)
      .post('/api/products')
      .send({
        name: 'Produit Invalide',
        price: -100
      })
      .expect(400);
  });

  test('Parcours : route inexistante', async () => {
    await request(app)
      .get('/api/route-qui-nexiste-pas')
      .expect(404);
  });
});
