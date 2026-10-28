// Base de données en mémoire (pour la démo)

class MemoryDB {
  constructor() {
    this.users = [];
    this.products = [];
    this.userIdCounter = 1;
    this.productIdCounter = 1;
  }

  // users
  async createUser(userData) {
    const user = {
      id: this.userIdCounter++,
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.users.push(user);
    return user;
  }

  async findUserById(id) {
    return this.users.find(user => user.id === id) || null;
  }

  async findUserByEmail(email) {
    return this.users.find(user => user.email === email) || null;
  }

  async getAllUsers() {
    return [...this.users];
  }

  async updateUser(id, updates) {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  async deleteUser(id) {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;
    
    this.users.splice(index, 1);
    return true;
  }

  // products
  async createProduct(productData) {
    const product = {
      id: this.productIdCounter++,
      ...productData,
      createdAt: new Date().toISOString()
    };
    this.products.push(product);
    return product;
  }

  async findProductById(id) {
    return this.products.find(product => product.id === id) || null;
  }

  async getAllProducts() {
    return [...this.products];
  }

  async updateProduct(id, updates) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return null;
    
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  async deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return false;
    
    this.products.splice(index, 1);
    return true;
  }

  reset() {
    this.users = [];
    this.products = [];
    this.userIdCounter = 1;
    this.productIdCounter = 1;
  }
}

const db = new MemoryDB();

module.exports = db;
