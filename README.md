# Projet de démo : tests d'une API back-end

Projet pour illustrer les concepts de tests sur une API Express.

## Table des matières

- [Architecture du projet](#architecture-du-projet)
- [Installation](#installation)
- [Lancer l'application](#lancer-lapplication)
- [Exécuter les tests](#exécuter-les-tests)
- [Types de tests](#types-de-tests)
- [Concepts illustrés](#concepts-illustrés)
- [Structure des tests](#structure-des-tests)

---

## Architecture du projet

```
testing-demo/
├── src/
│   ├── routes/           # Routes HTTP
│   ├── controllers/      # Contrôleurs
│   ├── services/         # Logique métier
│   ├── database/         # Base en mémoire
│   ├── utils/            # Calculatrice, validation
│   ├── app.js
│   └── server.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── jest.config.js
└── package.json
```

Architecture en couches :

```
Client HTTP
    ↓
Routes
    ↓
Contrôleurs
    ↓
Services
    ↓
Base de données (MemoryDB)
```

---

## Installation

```bash
cd testing-demo
npm install
```

Dépendances principales :
- `express` : framework web
- `jest` : framework de tests
- `supertest` : tests d'API HTTP
- `nodemon` : rechargement auto en dev

---

## Lancer l'application

```bash
npm start

# ou en mode dev
npm run dev
```

API sur `http://localhost:3000`

Endpoints :
- `GET /health`
- `GET /api/users` / `POST /api/users`
- `GET /api/users/:id` / `PUT /api/users/:id` / `DELETE /api/users/:id`
- `GET /api/products` / `POST /api/products`
- `GET /api/products/:id` / `PUT /api/products/:id` / `DELETE /api/products/:id`
- `POST /api/products/:id/discount`

---

## Exécuter les tests

```bash
npm test
npm run test:watch
npm run test:coverage
npm run test:unit
npm run test:integration
npm run test:e2e
```

---

## Types de tests

### 1. Tests unitaires (`tests/unit/`)

Tester des fonctions isolées, sans dépendances externes.

- Rapides
- Ciblés sur une seule fonction
- Déterministes

Fichiers :
- `calculatrice.test.js` — calculs (TVA, remises, prix TTC)
- `validation.test.js` — email, mot de passe, âge
- `userService.test.js` — service user avec mocks

Exemple :
```javascript
test('doit calculer la TVA à 20% sur 100€', () => {
  const tva = calculerTVA(100, 20);
  expect(tva).toBe(20);
});
```

Méthode AAA : Arrange (préparer) → Act (exécuter) → Assert (vérifier).

Les mocks servent à simuler la DB, tester les erreurs, et isoler le service.

---

### 2. Tests d'intégration (`tests/integration/`)

Vérifier que plusieurs composants marchent ensemble.

- Vraies requêtes HTTP avec Supertest
- Codes de statut HTTP
- Vraie DB en mémoire

Fichiers :
- `users.api.test.js`
- `products.api.test.js`

Exemple :
```javascript
test('doit créer un utilisateur avec des données valides', async () => {
  const response = await request(app)
    .post('/api/users')
    .send({ name: 'Alice', email: 'alice@example.com', password: 'SecurePass123' })
    .expect(201);

  expect(response.body).toHaveProperty('id');
  expect(response.body.name).toBe('Alice');
});
```

---

### 3. Tests End-to-End (`tests/e2e/`)

Tester un parcours utilisateur complet.

- Plus lents, plus complets
- Enchaînement d'opérations

Fichier : `user-journey.test.js`

---

## Concepts illustrés

### Méthode AAA

```javascript
test('exemple', () => {
  // Arrange
  const prixHT = 100;
  
  // Act
  const prixTTC = calculerPrixTTC(prixHT);
  
  // Assert
  expect(prixTTC).toBe(120);
});
```

### Mocks

```javascript
const mockDB = {
  findUserByEmail: jest.fn().mockResolvedValue(null),
  createUser: jest.fn().mockResolvedValue({ id: 1, name: 'Alice' })
};
```

Avantages : plus rapides, isolation, simulation d'erreurs.  
Limite : ne testent pas l'intégration réelle.

### Couverture de code

`npm run test:coverage` pour voir le % de lignes / branches / fonctions couvertes.

Seuil configuré dans `jest.config.js` : 70% mini.

Note : 100% de couverture ≠ zéro bug.

### Codes HTTP testés

| Code | Signification | Quand |
|------|---------------|-------|
| 200  | OK | GET, PUT, DELETE OK |
| 201  | Created | POST OK |
| 400  | Bad Request | Données invalides |
| 401  | Unauthorized | Auth nécessaire |
| 403  | Forbidden | Accès interdit |
| 404  | Not Found | Ressource introuvable |
| 500  | Internal Server Error | Erreur serveur |

### Pyramide des tests

```
       /\      ← E2E (peu, lents, complets)
      /  \
     /____\    ← Intégration
    /      \
   /________\  ← Unitaires (nombreux, rapides)
```

Dans ce projet : ~30 unitaires, ~25 intégration, ~3 E2E.

---

## Structure des tests

### `beforeEach()` — nettoyage entre les tests

```javascript
beforeEach(() => {
  db.reset();
});
```

Pour que chaque test soit indépendant.

### `describe()` — regrouper les tests

```javascript
describe('API Users', () => {
  describe('POST /api/users', () => {
    test('doit créer un utilisateur', () => { ... });
    test('doit rejeter un email invalide', () => { ... });
  });
});
```

### Assertions Jest courantes

```javascript
expect(value).toBe(5);
expect(value).toEqual({ a: 1 });
expect(value).toBeDefined();
expect(value).toBeNull();
expect(value).toBeTruthy();
expect(array).toHaveLength(3);
expect(object).toHaveProperty('name');
expect(fn).toThrow('error');
expect(num).toBeGreaterThan(10);
expect(num).toBeCloseTo(10.5, 1);
```

---

## Cas de tests couverts

### Cas nominaux
- User / produit créés OK
- Calcul auto du prix TTC
- Listes, mises à jour

### Cas limites
- Prix à 0, remise 0% ou 100%
- Liste vide, âge 0 ou 150

### Cas d'erreur
- Email invalide, mdp faible
- 404, champs manquants, prix négatif
- Email déjà utilisé

---

## Pour aller plus loin

Pas couverts ici mais vus en cours :
1. Tests de perf (JMeter, Artillery)
2. Tests de sécu (injections, XSS, CSRF, auth)
3. CI/CD (GitHub Actions, etc.)

Commandes utiles :
```bash
npm test -- calculatrice.test.js
npm test -- --verbose
npm test -- --testNamePattern="doit créer"
npm test -- -u
```

---

## Ressources

- [Jest](https://jestjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Express](https://expressjs.com/)

---

## Exercices suggérés

1. Ajouter un test unitaire pour une nouvelle fonction de calcul
2. Ajouter un endpoint `/api/users/:id/orders` + ses tests
3. Tester une erreur 500 en simulant une panne DB
4. Monter la couverture à 90%
5. Créer un parcours E2E d'erreur
6. Ajouter l'auth et tester 401/403

---

## Licence

Projet à but éducatif.
