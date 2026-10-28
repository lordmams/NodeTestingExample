// Tests unitaires UserService avec mocks
// On recrée la classe ici car le module exporte une instance singleton

class UserService {
  constructor(database) {
    this.db = database;
  }

  async createUser(userData) {
    const { validerEmail, validerMotDePasse } = require('../../src/utils/validation');
    
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

    const existingUser = await this.db.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

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

describe('UserService - Tests Unitaires avec Mocks', () => {
  let userService;
  let mockDB;

  beforeEach(() => {
    mockDB = {
      createUser: jest.fn(),
      findUserById: jest.fn(),
      findUserByEmail: jest.fn(),
      getAllUsers: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn()
    };

    userService = new UserService(mockDB);
  });

  describe('createUser()', () => {
    test('doit créer un utilisateur avec des données valides', async () => {
      const userData = {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'Password123'
      };

      mockDB.findUserByEmail.mockResolvedValue(null);
      mockDB.createUser.mockResolvedValue({
        id: 1,
        ...userData,
        createdAt: '2024-01-01T00:00:00.000Z'
      });

      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.name).toBe('Alice');
      expect(user.email).toBe('alice@example.com');
      expect(user.password).toBeUndefined(); // pas de mdp dans la réponse
      
      expect(mockDB.findUserByEmail).toHaveBeenCalledWith('alice@example.com');
      expect(mockDB.createUser).toHaveBeenCalledTimes(1);
    });

    test('doit rejeter un email invalide', async () => {
      const userData = {
        name: 'Bob',
        email: 'email-invalide',
        password: 'Password123'
      };

      await expect(userService.createUser(userData)).rejects.toThrow('Email invalide');
      
      expect(mockDB.findUserByEmail).not.toHaveBeenCalled();
      expect(mockDB.createUser).not.toHaveBeenCalled();
    });

    test('doit rejeter un mot de passe faible', async () => {
      const userData = {
        name: 'Charlie',
        email: 'charlie@example.com',
        password: 'weak'
      };

      await expect(userService.createUser(userData)).rejects.toThrow();
      expect(mockDB.createUser).not.toHaveBeenCalled();
    });

    test('doit rejeter si l\'email existe déjà', async () => {
      const userData = {
        name: 'David',
        email: 'existing@example.com',
        password: 'Password123'
      };

      mockDB.findUserByEmail.mockResolvedValue({
        id: 1,
        email: 'existing@example.com'
      });

      await expect(userService.createUser(userData)).rejects.toThrow('existe déjà');
      expect(mockDB.createUser).not.toHaveBeenCalled();
    });

    test('doit gérer une erreur de la base de données', async () => {
      const userData = {
        name: 'Eve',
        email: 'eve@example.com',
        password: 'Password123'
      };

      mockDB.findUserByEmail.mockResolvedValue(null);
      mockDB.createUser.mockRejectedValue(new Error('Database connection failed'));

      await expect(userService.createUser(userData)).rejects.toThrow('Database connection failed');
    });
  });

  describe('getUserById()', () => {
    test('doit retourner un utilisateur existant', async () => {
      const mockUser = {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        password: 'hashedpassword'
      };

      mockDB.findUserById.mockResolvedValue(mockUser);

      const user = await userService.getUserById(1);

      expect(user.id).toBe(1);
      expect(user.name).toBe('Alice');
      expect(user.password).toBeUndefined();
      expect(mockDB.findUserById).toHaveBeenCalledWith(1);
    });

    test('doit rejeter un ID invalide', async () => {
      await expect(userService.getUserById('invalid')).rejects.toThrow('ID invalide');
      await expect(userService.getUserById(null)).rejects.toThrow('ID invalide');
      
      expect(mockDB.findUserById).not.toHaveBeenCalled();
    });

    test('doit rejeter si l\'utilisateur n\'existe pas', async () => {
      mockDB.findUserById.mockResolvedValue(null);

      await expect(userService.getUserById(999)).rejects.toThrow('Utilisateur introuvable');
    });
  });

  describe('getAllUsers()', () => {
    test('doit retourner tous les utilisateurs sans mots de passe', async () => {
      const mockUsers = [
        { id: 1, name: 'Alice', email: 'alice@example.com', password: 'hash1' },
        { id: 2, name: 'Bob', email: 'bob@example.com', password: 'hash2' }
      ];

      mockDB.getAllUsers.mockResolvedValue(mockUsers);

      const users = await userService.getAllUsers();

      expect(users).toHaveLength(2);
      expect(users[0].password).toBeUndefined();
      expect(users[1].password).toBeUndefined();
      expect(users[0].name).toBe('Alice');
    });

    test('doit retourner un tableau vide si aucun utilisateur', async () => {
      mockDB.getAllUsers.mockResolvedValue([]);

      const users = await userService.getAllUsers();

      expect(users).toEqual([]);
    });
  });

  describe('deleteUser()', () => {
    test('doit supprimer un utilisateur existant', async () => {
      mockDB.deleteUser.mockResolvedValue(true);

      const result = await userService.deleteUser(1);

      expect(result.message).toContain('supprimé avec succès');
      expect(mockDB.deleteUser).toHaveBeenCalledWith(1);
    });

    test('doit rejeter si l\'utilisateur n\'existe pas', async () => {
      mockDB.deleteUser.mockResolvedValue(false);

      await expect(userService.deleteUser(999)).rejects.toThrow('Utilisateur introuvable');
    });
  });
});
