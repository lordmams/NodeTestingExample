// Tests unitaires validation

const { 
  validerEmail, 
  validerMotDePasse, 
  validerAge 
} = require('../../src/utils/validation');

describe('Validation - Tests Unitaires', () => {
  
  describe('validerEmail()', () => {
    test('doit accepter un email valide', () => {
      expect(validerEmail('test@example.com')).toBe(true);
      expect(validerEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    test('doit rejeter un email sans @', () => {
      expect(validerEmail('testexample.com')).toBe(false);
    });

    test('doit rejeter un email sans domaine', () => {
      expect(validerEmail('test@')).toBe(false);
    });

    test('doit rejeter un email sans extension', () => {
      expect(validerEmail('test@example')).toBe(false);
    });

    test('doit rejeter une chaîne vide', () => {
      expect(validerEmail('')).toBe(false);
    });
  });

  describe('validerMotDePasse()', () => {
    test('doit accepter un mot de passe valide', () => {
      const result = validerMotDePasse('Password123');
      expect(result.valide).toBe(true);
      expect(result.message).toBe('Mot de passe valide');
    });

    test('doit rejeter un mot de passe trop court', () => {
      const result = validerMotDePasse('Pass1');
      expect(result.valide).toBe(false);
      expect(result.message).toContain('8 caractères');
    });

    test('doit rejeter un mot de passe sans majuscule', () => {
      const result = validerMotDePasse('password123');
      expect(result.valide).toBe(false);
      expect(result.message).toContain('majuscule');
    });

    test('doit rejeter un mot de passe sans minuscule', () => {
      const result = validerMotDePasse('PASSWORD123');
      expect(result.valide).toBe(false);
      expect(result.message).toContain('minuscule');
    });

    test('doit rejeter un mot de passe sans chiffre', () => {
      const result = validerMotDePasse('PasswordABC');
      expect(result.valide).toBe(false);
      expect(result.message).toContain('chiffre');
    });

    test('doit tester plusieurs conditions en cascade', () => {
      // trop court + sans majuscule -> on prend la première erreur
      let result = validerMotDePasse('pass1');
      expect(result.valide).toBe(false);
      expect(result.message).toContain('8 caractères');
    });
  });

  describe('validerAge()', () => {
    test('doit accepter un âge valide', () => {
      expect(validerAge(25)).toBe(true);
      expect(validerAge(0)).toBe(true);
      expect(validerAge(150)).toBe(true);
    });

    test('doit rejeter un âge négatif', () => {
      expect(validerAge(-1)).toBe(false);
    });

    test('doit rejeter un âge supérieur à 150', () => {
      expect(validerAge(151)).toBe(false);
    });

    test('doit rejeter un nombre décimal', () => {
      expect(validerAge(25.5)).toBe(false);
    });

    test('doit rejeter une chaîne', () => {
      expect(validerAge('25')).toBe(false);
    });
  });
});
