const productService = require('../services/productService');

class ProductController {
  async create(req, res) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      if (error.message.includes('requis') || error.message.includes('négatif')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erreur serveur interne' });
      }
    }
  }

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const product = await productService.getProductById(id);
      res.status(200).json(product);
    } catch (error) {
      if (error.message === 'Produit introuvable') {
        res.status(404).json({ error: error.message });
      } else if (error.message === 'ID invalide') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erreur serveur interne' });
      }
    }
  }

  async getAll(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur interne' });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const product = await productService.updateProduct(id, req.body);
      res.status(200).json(product);
    } catch (error) {
      if (error.message === 'Produit introuvable') {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('négatif')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erreur serveur interne' });
      }
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const result = await productService.deleteProduct(id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Produit introuvable') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erreur serveur interne' });
      }
    }
  }

  async applyDiscount(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { discount } = req.body;
      
      if (!discount || discount < 0 || discount > 100) {
        return res.status(400).json({ error: 'Remise invalide (doit être entre 0 et 100)' });
      }

      const product = await productService.appliquerRemise(id, discount);
      res.status(200).json(product);
    } catch (error) {
      if (error.message === 'Produit introuvable') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erreur serveur interne' });
      }
    }
  }
}

module.exports = new ProductController();
