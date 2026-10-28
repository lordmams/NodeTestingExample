// Service produits

const db = require('../database/memoryDB');
const { calculerPrixTTC, calculerRemise } = require('../utils/calculatrice');

class ProductService {
  constructor(database = db) {
    this.db = database;
  }

  async createProduct(productData) {
    // Validation
    if (!productData.name || !productData.price) {
      throw new Error('Nom et prix sont requis');
    }

    if (productData.price < 0) {
      throw new Error('Le prix ne peut pas être négatif');
    }

    // Calculer le prix TTC si non fourni
    const prixTTC = productData.prixTTC || calculerPrixTTC(productData.price);

    const product = await this.db.createProduct({
      name: productData.name,
      price: productData.price,
      prixTTC,
      description: productData.description || '',
      stock: productData.stock || 0
    });

    return product;
  }

  async getProductById(id) {
    if (!id || typeof id !== 'number') {
      throw new Error('ID invalide');
    }

    const product = await this.db.findProductById(id);
    if (!product) {
      throw new Error('Produit introuvable');
    }

    return product;
  }

  async getAllProducts() {
    return await this.db.getAllProducts();
  }

  async updateProduct(id, updates) {
    if (!id || typeof id !== 'number') {
      throw new Error('ID invalide');
    }

    // Recalculer le prix TTC si le prix change
    if (updates.price !== undefined) {
      if (updates.price < 0) {
        throw new Error('Le prix ne peut pas être négatif');
      }
      updates.prixTTC = calculerPrixTTC(updates.price);
    }

    const product = await this.db.updateProduct(id, updates);
    if (!product) {
      throw new Error('Produit introuvable');
    }

    return product;
  }

  async deleteProduct(id) {
    if (!id || typeof id !== 'number') {
      throw new Error('ID invalide');
    }

    const deleted = await this.db.deleteProduct(id);
    if (!deleted) {
      throw new Error('Produit introuvable');
    }

    return { message: 'Produit supprimé avec succès' };
  }

  async appliquerRemise(productId, pourcentageRemise) {
    const product = await this.getProductById(productId);
    
    const nouveauPrix = calculerRemise(product.price, pourcentageRemise);
    
    return await this.updateProduct(productId, { price: nouveauPrix });
  }
}

module.exports = new ProductService();
