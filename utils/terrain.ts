function coordsToIndex(x, z, bbox, width, height) {
  const normalizedX = (x - bbox[0]) / (bbox[2] - bbox[0]);
  const normalizedZ = (z - bbox[1]) / (bbox[3] - bbox[1]);
  const i = Math.round(normalizedX * width);
  const j = Math.round(normalizedZ * height);
  return { i, j };
}

// Obtenir la hauteur pour les coordonnées données
function getHeightAt(x, z, data, bbox, width, height) {
  const { i, j } = coordsToIndex(x, z, bbox, width, height);
  if (i >= 0 && i < width && j >= 0 && j < height) {
    return data[j * width + i];
  }
  return 0;
}

function placeObjOnTerrain(box, terrainX, terrainZ, data, bbox, width, height) {
  // Convertir les coordonnées 3D en indices du tableau
  const { i, j } = coordsToIndex(terrainX, terrainZ, bbox, width, height);

  // Vérifier les limites pour éviter les erreurs
  if (i >= 0 && i < width && j >= 0 && j < height) {
    const height = data[j * width + i] / 100; // Hauteur à la position (x, z)
    box.position.set(terrainX, height, terrainZ);
  } else {
    console.warn("Les coordonnées sont hors limites du terrain.");
  }
}

export { coordsToIndex, getHeightAt, placeObjOnTerrain };
