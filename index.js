// index.js - Estructura completa
async function initIndex() {
  const data = await loadDataset();

  // ---- 1. KPIs ----
  // ... código de KPIs

  // ---- 2. Gráfico de edades ----
  // ... código del gráfico

  // ---- 3. Mapa de países ---- ← NUEVA SECCIÓN
  // ... el código nuevo aquí

  // ---- 4. Animaciones ----
  // ... código de animaciones
}

// ---- FUNCIONES AUXILIARES FUERA de initIndex() ---- 
function getBandera(pais) {
  // ... código de la función
}

function detectarPais(lugar) {
  // ... código de la función
}

function acortarNombre(pais) {
  // ... código de la función
}

document.addEventListener("DOMContentLoaded", initIndex);
