// Validation

function validerEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validerMotDePasse(motDePasse) {
  // Au moins 8 caractères, une majuscule, une minuscule, un chiffre
  if (motDePasse.length < 8) {
    return { valide: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
  }
  if (!/[A-Z]/.test(motDePasse)) {
    return { valide: false, message: 'Le mot de passe doit contenir au moins une majuscule' };
  }
  if (!/[a-z]/.test(motDePasse)) {
    return { valide: false, message: 'Le mot de passe doit contenir au moins une minuscule' };
  }
  if (!/[0-9]/.test(motDePasse)) {
    return { valide: false, message: 'Le mot de passe doit contenir au moins un chiffre' };
  }
  return { valide: true, message: 'Mot de passe valide' };
}

function validerAge(age) {
  return Number.isInteger(age) && age >= 0 && age <= 150;
}

module.exports = {
  validerEmail,
  validerMotDePasse,
  validerAge
};
