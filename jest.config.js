/**
 * Configuration Jest
 */

module.exports = {
  // Environnement de test
  testEnvironment: 'node',

  // Pattern pour trouver les tests
  testMatch: [
    '**/tests/**/*.test.js'
  ],

  // Couverture de code
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js' // Exclure le fichier de démarrage du serveur
  ],

  // Répertoire pour les rapports de couverture
  coverageDirectory: 'coverage',

  // Formats de rapport de couverture
  coverageReporters: ['text', 'lcov', 'html'],

  // Seuils de couverture (optionnel)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Verbose pour voir chaque test
  verbose: true,

  // Timeout pour les tests async (par défaut 5000ms)
  testTimeout: 10000
};
