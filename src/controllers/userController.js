const userService = require('../services/userService');

class UserController {
  async create(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error.message.includes('existe déjà') || 
          error.message.includes('invalide') ||
          error.message.includes('requis') ||
          error.message.includes('caractères') ||
          error.message.includes('majuscule') ||
          error.message.includes('minuscule') ||
          error.message.includes('chiffre')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erreur serveur interne' });
      }
    }
  }

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const user = await userService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      if (error.message === 'Utilisateur introuvable') {
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
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur interne' });
    }
  }

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const user = await userService.updateUser(id, req.body);
      res.status(200).json(user);
    } catch (error) {
      if (error.message === 'Utilisateur introuvable') {
        res.status(404).json({ error: error.message });
      } else if (error.message === 'ID invalide') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erreur serveur interne' });
      }
    }
  }

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      const result = await userService.deleteUser(id);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Utilisateur introuvable') {
        res.status(404).json({ error: error.message });
      } else if (error.message === 'ID invalide') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erreur serveur interne' });
      }
    }
  }
}

module.exports = new UserController();
