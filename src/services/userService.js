// Service utilisateurs

const db = require('../database/memoryDB');
const { validerEmail, validerMotDePasse } = require('../utils/validation');

class UserService {
  constructor(database = db) {
    this.db = database;
  }

  async createUser(userData) {
    // Validation
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error('Nom, email et mot de passe sont requis');
    }

    if (!validerEmail(userData.email)) {
      throw new Error('Email invalide');
    }

    const validationMotDePasse = validerMotDePasse(userData.password);
    if (!validationMotDePasse.valide) {
      throw new Error(validationMotDePasse.message);
    }

    // Vérifier si l'email existe déjà
    const existingUser = await this.db.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // en vrai on hasherait le mdp
    const user = await this.db.createUser({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      age: userData.age || null
    });

    const { password, ...userSansPassword } = user;
    return userSansPassword;
  }

  async getUserById(id) {
    if (!id || typeof id !== 'number') {
      throw new Error('ID invalide');
    }

    const user = await this.db.findUserById(id);
    if (!user) {
      throw new Error('Utilisateur introuvable');
    }

    const { password, ...userSansPassword } = user;
    return userSansPassword;
  }

  async getAllUsers() {
    const users = await this.db.getAllUsers();
    return users.map(({ password, ...user }) => user);
  }

  async updateUser(id, updates) {
    if (!id || typeof id !== 'number') {
      throw new Error('ID invalide');
    }

    // Ne pas permettre de changer l'email ou l'ID
    const { email, password, ...safeUpdates } = updates;

    const user = await this.db.updateUser(id, safeUpdates);
    if (!user) {
      throw new Error('Utilisateur introuvable');
    }

    const { password: _, ...userSansPassword } = user;
    return userSansPassword;
  }

  async deleteUser(id) {
    if (!id || typeof id !== 'number') {
      throw new Error('ID invalide');
    }

    const deleted = await this.db.deleteUser(id);
    if (!deleted) {
      throw new Error('Utilisateur introuvable');
    }

    return { message: 'Utilisateur supprimé avec succès' };
  }
}

module.exports = new UserService();
