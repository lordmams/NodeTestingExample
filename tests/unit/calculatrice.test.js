// Tests unitaires pour la calculatrice

const { 
  addition, 
  calculerTVA, 
  calculerPrixTTC, 
  calculerRemise 
} = require('../../src/utils/calculatrice');

describe('Calculatrice - Tests Unitaires', () => {
  
  describe('addition()', () => {
    test('doit additionner deux nombres positifs', () => {
      const a = 2;
      const b = 3;
      const resultat = addition(a, b);
      expect(resultat).toBe(5);
    });

    test('doit gérer les nombres négatifs', () => {
      expect(addition(-5, 3)).toBe(-2);
      expect(addition(-5, -3)).toBe(-8);
    });

    test('doit gérer le zéro', () => {
      expect(addition(0, 5)).toBe(5);
      expect(addition(5, 0)).toBe(5);
      expect(addition(0, 0)).toBe(0);
    });
  });

  describe('calculerTVA()', () => {
    test('doit calculer la TVA à 20% sur 100€', () => {
      const tva = calculerTVA(100, 20);
      expect(tva).toBe(20);
    });

    test('doit utiliser 20% par défaut', () => {
      const tva = calculerTVA(100);
      expect(tva).toBe(20);
    });

    test('doit calculer correctement avec différents taux', () => {
      expect(calculerTVA(100, 5.5)).toBe(5.5);
      expect(calculerTVA(100, 10)).toBe(10);
    });

    test('doit rejeter un prix négatif', () => {
      expect(() => calculerTVA(-10, 20)).toThrow('Prix invalide');
    });

    test('doit rejeter un taux de TVA invalide', () => {
      expect(() => calculerTVA(100, -5)).toThrow('Taux de TVA invalide');
      expect(() => calculerTVA(100, 150)).toThrow('Taux de TVA invalide');
    });

    test('doit gérer les cas limites', () => {
      expect(calculerTVA(0, 20)).toBe(0);
      expect(calculerTVA(100, 0)).toBe(0);
      expect(calculerTVA(100, 100)).toBe(100);
    });
  });

  describe('calculerPrixTTC()', () => {
    test('doit calculer le prix TTC avec TVA à 20%', () => {
      const prixTTC = calculerPrixTTC(100, 20);
      expect(prixTTC).toBe(120);
    });

    test('doit utiliser 20% par défaut', () => {
      const prixTTC = calculerPrixTTC(100);
      expect(prixTTC).toBe(120);
    });

    test('doit gérer différents taux', () => {
      expect(calculerPrixTTC(100, 5.5)).toBeCloseTo(105.5);
      expect(calculerPrixTTC(100, 10)).toBe(110);
    });
  });

  describe('calculerRemise()', () => {
    test('doit appliquer une remise de 10%', () => {
      const prixRemise = calculerRemise(100, 10);
      expect(prixRemise).toBe(90);
    });

    test('doit gérer une remise de 50%', () => {
      expect(calculerRemise(100, 50)).toBe(50);
    });

    test('doit gérer une remise de 0%', () => {
      expect(calculerRemise(100, 0)).toBe(100);
    });

    test('doit rejeter un prix négatif', () => {
      expect(() => calculerRemise(-10, 20)).toThrow('Prix invalide');
    });

    test('doit rejeter un pourcentage invalide', () => {
      expect(() => calculerRemise(100, -10)).toThrow('Pourcentage de remise invalide');
      expect(() => calculerRemise(100, 150)).toThrow('Pourcentage de remise invalide');
    });
  });
});
