// Utilitaires de calcul

function addition(a, b) {
  return a + b;
}

function calculerTVA(prixHT, tauxTVA = 20) {
  if (prixHT < 0) {
    throw new Error('Prix invalide : le prix ne peut pas être négatif');
  }
  if (tauxTVA < 0 || tauxTVA > 100) {
    throw new Error('Taux de TVA invalide : doit être entre 0 et 100');
  }
  return (prixHT * tauxTVA) / 100;
}

function calculerPrixTTC(prixHT, tauxTVA = 20) {
  const tva = calculerTVA(prixHT, tauxTVA);
  return prixHT + tva;
}

function calculerRemise(prix, pourcentageRemise) {
  if (prix < 0) {
    throw new Error('Prix invalide');
  }
  if (pourcentageRemise < 0 || pourcentageRemise > 100) {
    throw new Error('Pourcentage de remise invalide');
  }
  return prix - (prix * pourcentageRemise) / 100;
}

module.exports = {
  addition,
  calculerTVA,
  calculerPrixTTC,
  calculerRemise
};
