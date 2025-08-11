// ===== IMPORTS =====
import './components/dna-viewer.js'; // Componente de ADN 3D
import './components/patient-filter.js'; // Filtros interactivos
import { initThemeSwitcher } from './lib/theme-manager.js'; // Modo oscuro/claro

// ===== FUNCIONES PRINCIPALES =====
/**
 * Inicializa la aplicación
 */
function initApp() {
  console.log('App iniciada');
  
  // 1. Cargar datos iniciales
  loadInitialData();

  // 2. Configurar tema (claro/oscuro)
  initThemeSwitcher();

  // 3. Inicializar componentes dinámicos
  initDynamicComponents();
}

/**
 * Carga datos iniciales desde API
 */
async function loadInitialData() {
  try {
    const response = await fetch('/api/patients');
    const data = await response.json();
    console.log('Datos cargados:', data.length, 'pacientes');
  } catch (error) {
    console.error('Error cargando datos:', error);
  }
}

/**
 * Inicializa componentes interactivos
 */
function initDynamicComponents() {
  // Ejemplo: Tooltips para genes
  document.querySelectorAll('[data-gene]').forEach(element => {
    element.addEventListener('click', (e) => {
      const gene = e.target.dataset.gene;
      showGeneInfo(gene);
    });
  });
}

// ===== UTILIDADES =====
function showGeneInfo(geneName) {
  console.log('Gen seleccionado:', geneName);
  // Lógica para mostrar información del gen
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', initApp);
