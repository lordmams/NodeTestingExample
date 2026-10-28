# Guide de démarrage rapide

## Installation et premier lancement (5 minutes)

### 1. Installer les dépendances
```bash
cd testing-demo
npm install
```

### 2. Lancer les tests
```bash
npm test
```

Tous les tests devraient passer.

### 3. Voir le rapport de couverture
```bash
npm run test:coverage
```

Rapport HTML dans `coverage/lcov-report/index.html`.

### 4. Lancer l'application
```bash
npm start
```

API sur `http://localhost:3000`

### 5. Tester manuellement
```bash
curl http://localhost:3000/health

curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"SecurePass123"}'
```

---

## Commandes

### Principales
```bash
npm start              # serveur
npm run dev            # mode dev (reload auto)
npm test               # tous les tests
npm run test:coverage  # avec couverture
```

### Tests spécifiques
```bash
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:watch
```

### Jest avancé
```bash
npm test -- calculatrice.test.js
npm test -- --testNamePattern="doit créer"
npm test -- --verbose
```

---

## Exploration du code

### 1. Tests unitaires simples
`tests/unit/calculatrice.test.js` — fonctions pures, AAA, cas nominaux / limites / erreurs

### 2. Mocks
`tests/unit/userService.test.js` — isolation, simu d'erreurs DB

### 3. Intégration
`tests/integration/users.api.test.js` — HTTP avec Supertest, codes de statut

### 4. E2E
`tests/e2e/user-journey.test.js` — parcours complets

---

## Exercices pratiques

### Exercice 1 : Ajouter un test unitaire

Dans `src/utils/calculatrice.js` :
```javascript
function calculerMarge(prixVente, prixAchat) {
  if (prixVente < prixAchat) {
    throw new Error('Le prix de vente doit être supérieur au prix d\'achat');
  }
  return prixVente - prixAchat;
}
```

Dans `tests/unit/calculatrice.test.js` :
```javascript
describe('calculerMarge()', () => {
  test('doit calculer la marge correctement', () => {
    const marge = calculerMarge(120, 100);
    expect(marge).toBe(20);
  });

  test('doit rejeter si prix de vente < prix d\'achat', () => {
    expect(() => calculerMarge(80, 100)).toThrow();
  });
});
```

Puis `npm test`.

---

### Exercice 2 : Ajouter un endpoint

1. Créer `src/routes/statsRoutes.js`
2. Route GET `/api/stats` qui retourne :
```json
{
  "totalUsers": 10,
  "totalProducts": 25
}
```
3. Créer `tests/integration/stats.api.test.js`
4. Vérifier le 200 et la structure

---

### Exercice 3 : Améliorer la couverture

1. `npm run test:coverage`
2. Regarder les lignes en rouge dans le rapport HTML
3. Ajouter des tests
4. Relancer

---

### Exercice 4 : Tester une erreur 500

Dans `tests/unit/userService.test.js` :
```javascript
test('doit gérer une erreur 500 de la base', async () => {
  mockDB.findUserByEmail.mockResolvedValue(null);
  mockDB.createUser.mockRejectedValue(new Error('Database unavailable'));

  await expect(userService.createUser({
    name: 'Test',
    email: 'test@example.com',
    password: 'SecurePass123'
  })).rejects.toThrow('Database unavailable');
});
```

---

## Points clés

### Les 3 niveaux de tests
```
Unitaire     → fonction isolée (rapide, nombreux)
Intégration  → composants ensemble
E2E          → parcours complet (lent, peu)
```

### Méthode AAA
```javascript
test('exemple', () => {
  // Arrange
  const data = { ... };
  
  // Act
  const result = myFunction(data);
  
  // Assert
  expect(result).toBe(expected);
});
```

### Quand utiliser les mocks ?
- Oui : tests unitaires de services, simuler des erreurs, isoler une dépendance lente
- Non : tests d'intégration (on veut l'interaction réelle)

### Couverture
- 100% ≠ zéro bug
- Priorité à la qualité des tests
- Seuil raisonnable : 70-80%

---

## FAQ

**Pourquoi mes tests échouent après une modif ?**  
C'est le but — ils détectent les régressions. Corrige le code ou adapte les tests si le comportement attendu a changé.

**Dois-je tester toutes les fonctions ?**  
Priorité aux fonctions critiques et complexes. Les getters/setters simples, moins important.

**Combien de temps prennent les tests ?**  
Unitaires ~50ms, intégration ~300ms, E2E ~500ms. Total : moins d'1 seconde.

**Écrire les tests avant le code ?**  
C'est le TDD. Pas obligatoire, mais ça clarifie le comportement attendu.

**Comment déboguer un test qui échoue ?**
```bash
console.log('Response:', response.body);
npm test -- --testNamePattern="nom du test"
npm run test:watch
```

---

## Ressources

- [Jest](https://jestjs.io/docs/getting-started)
- [Supertest](https://github.com/visionmedia/supertest)
- [Express](https://expressjs.com/fr/guide/routing.html)

Fichiers utiles : `README.md`, `EXEMPLES_REQUETES.md`, `jest.config.js`, `package.json`
