# Exemples de requêtes HTTP pour tests manuels

Exemples à utiliser dans Postman, Thunder Client (VS Code), ou avec curl.

---

## Health Check

### GET /health

```bash
curl http://localhost:3000/health
```

Réponse attendue (200 OK) :
```json
{
  "status": "OK",
  "message": "API is running"
}
```

---

## API Users

### 1. Créer un utilisateur

**POST /api/users**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Dupont",
    "email": "alice@example.com",
    "password": "SecurePass123",
    "age": 28
  }'
```

Réponse attendue (201 Created) :
```json
{
  "id": 1,
  "name": "Alice Dupont",
  "email": "alice@example.com",
  "age": 28,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

Note : le mot de passe ne doit jamais être retourné dans la réponse.

---

### 2. Récupérer tous les utilisateurs

**GET /api/users**

```bash
curl http://localhost:3000/api/users
```

Réponse attendue (200 OK) :
```json
[
  {
    "id": 1,
    "name": "Alice Dupont",
    "email": "alice@example.com",
    "age": 28,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Bob Martin",
    "email": "bob@example.com",
    "age": 35,
    "createdAt": "2024-01-15T10:31:00.000Z"
  }
]
```

---

### 3. Récupérer un utilisateur par ID

**GET /api/users/:id**

```bash
curl http://localhost:3000/api/users/1
```

Réponse attendue (200 OK) :
```json
{
  "id": 1,
  "name": "Alice Dupont",
  "email": "alice@example.com",
  "age": 28,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

Cas d'erreur — utilisateur inexistant (404) :
```bash
curl http://localhost:3000/api/users/999
```
```json
{
  "error": "Utilisateur introuvable"
}
```

---

### 4. Mettre à jour un utilisateur

**PUT /api/users/:id**

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Dupont-Martin",
    "age": 29
  }'
```

Réponse attendue (200 OK) :
```json
{
  "id": 1,
  "name": "Alice Dupont-Martin",
  "email": "alice@example.com",
  "age": 29,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

Note : l'email ne peut pas être modifié.

---

### 5. Supprimer un utilisateur

**DELETE /api/users/:id**

```bash
curl -X DELETE http://localhost:3000/api/users/1
```

Réponse attendue (200 OK) :
```json
{
  "message": "Utilisateur supprimé avec succès"
}
```

---

## API Products

### 1. Créer un produit

**POST /api/products**

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ordinateur Portable",
    "price": 1000,
    "description": "MacBook Pro 14 pouces",
    "stock": 5
  }'
```

Réponse attendue (201 Created) :
```json
{
  "id": 1,
  "name": "Ordinateur Portable",
  "price": 1000,
  "prixTTC": 1200,
  "description": "MacBook Pro 14 pouces",
  "stock": 5,
  "createdAt": "2024-01-15T10:40:00.000Z"
}
```

Note : le prix TTC est calculé auto (prix HT + 20% TVA).

---

### 2. Récupérer tous les produits

**GET /api/products**

```bash
curl http://localhost:3000/api/products
```

---

### 3. Récupérer un produit par ID

**GET /api/products/:id**

```bash
curl http://localhost:3000/api/products/1
```

---

### 4. Mettre à jour un produit

**PUT /api/products/:id**

```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 3,
    "price": 950
  }'
```

Note : le TTC est recalculé si le prix change.

---

### 5. Appliquer une remise

**POST /api/products/:id/discount**

```bash
curl -X POST http://localhost:3000/api/products/1/discount \
  -H "Content-Type: application/json" \
  -d '{
    "discount": 20
  }'
```

Calcul : 1000€ - 20% = 800€ HT → 960€ TTC

---

### 6. Supprimer un produit

**DELETE /api/products/:id**

```bash
curl -X DELETE http://localhost:3000/api/products/1
```

---

## Cas d'erreur

### 1. Email invalide (400)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob",
    "email": "email-invalide",
    "password": "SecurePass123"
  }'
```

```json
{
  "error": "Email invalide"
}
```

---

### 2. Mot de passe trop faible (400)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Charlie",
    "email": "charlie@example.com",
    "password": "weak"
  }'
```

```json
{
  "error": "Le mot de passe doit contenir au moins 8 caractères"
}
```

---

### 3. Email déjà utilisé (400)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice 2",
    "email": "alice@example.com",
    "password": "SecurePass123"
  }'
```

```json
{
  "error": "Un utilisateur avec cet email existe déjà"
}
```

---

### 4. Prix négatif (400)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produit",
    "price": -100
  }'
```

```json
{
  "error": "Le prix ne peut pas être négatif"
}
```

---

### 5. Route inexistante (404)

```bash
curl http://localhost:3000/api/route-inexistante
```

```json
{
  "error": "Route non trouvée"
}
```

---

## Scénario de test manuel complet

### Étape 1 : health check
```bash
curl http://localhost:3000/health
```

### Étape 2 : créer un user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Étape 3 : récupérer le user
```bash
curl http://localhost:3000/api/users/1
```

### Étape 4 : créer un produit
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Souris Gaming",
    "price": 50,
    "stock": 10
  }'
```

### Étape 5 : appliquer une remise
```bash
curl -X POST http://localhost:3000/api/products/1/discount \
  -H "Content-Type: application/json" \
  -d '{"discount": 10}'
```

### Étape 6 : vérifier le prix
```bash
curl http://localhost:3000/api/products/1
```
Prix attendu : 45€ HT → 54€ TTC

### Étape 7 : maj profil
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User Updated"}'
```

### Étape 8 : lister les produits
```bash
curl http://localhost:3000/api/products
```

### Étape 9 : supprimer le produit
```bash
curl -X DELETE http://localhost:3000/api/products/1
```

### Étape 10 : vérifier le 404
```bash
curl http://localhost:3000/api/products/1
```

---

## Codes HTTP à vérifier

| Code | Quand | Exemple |
|------|-------|---------|
| 200  | Opération OK | GET, PUT, DELETE |
| 201  | Ressource créée | POST OK |
| 400  | Données invalides | Email invalide, prix négatif |
| 404  | Introuvable | GET /api/users/999 |
| 500  | Erreur serveur | Panne DB |

---

## Conseils pour les tests manuels

1. Cas nominaux : données valides
2. Cas limites : 0, valeurs max
3. Erreurs : données invalides, ressources inexistantes
4. Vérifier les codes HTTP
5. Vérifier le format JSON
6. Le mdp ne doit jamais être exposé

---

## Manuels vs automatisés

**Manuels** : utiles pour explorer, mais répétitifs et faciles à oublier.

**Automatisés** (Jest + Supertest) : reproductibles, rapides, détectent les régressions, intégrables en CI.

Les manuels aident à découvrir ; les auto pour la fiabilité au long terme.
