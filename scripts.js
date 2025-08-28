// scripts.js
// ======================
// FUNCIONES BÁSICAS
// ======================
function $(q, ctx = document) { return ctx.querySelector(q) }
function $all(q, ctx = document) { return Array.from(ctx.querySelectorAll(q)) }

// ======================
// NORMALIZACIÓN DE DATOS
// ======================
function normalizeRecord(record) {
  const edad = Number(record['Edad'] || record['Edad '] || 0);
  const genero = (record['Género'] || record['Sexo'] || '').toString().trim();
  const generoNormalizado = genero === 'M' ? 'Masculino' : genero === 'F' ? 'Femenino' : genero;

  return {
    id: `${record['Nombre']}-${edad}-${generoNormalizado}`.toLowerCase().replace(/\s+/g, '-'),
    nombre: record['Nombre'] || '',
    edad: edad,
    genero: generoNormalizado,
    localizacion: record['Localización'] || record['Localizacion'] || '',
    sintomas: record['Síntomas'] || record['síntomas principales'] || record['síntomas principales  '] || '',
    gravedad: record['Gravedad'] || record['Nivel de afectación'] || '',
    pruebas: record['Pruebas realizadas'] || record['Pruebas realizadas  (ej: array genético, EEG, resonancia)  '] || '',
    medicamentos: record['Medicamentos actuales/pasados'] || record['Medicamentos actuales/pasados\n (ej: risperidona, magnesio):  '] || '',
    terapias: record['Terapias recibidas'] || record['Terapias recibidas\n(logopedia, psicoterapia, etc.):  '] || '',
    desafios: record['Necesidades y Desafíos'] || record[' Necesidades y Desafíos'] || '',
    __origen: record.__origen || "data"
  };
}

// ======================
// CARGA DE DATOS
// ======================
async function loadData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status} al cargar ${url}`);
    return await res.json();
  } catch (err) {
    console.error(`Error procesando ${url}:`, err);
    return [];
  }
}

// Función que une validados y no validados
async function loadDataset() {
  const [validados, noValidados] = await Promise.all([
    loadData("data/casos_validados.json"),
    loadData("data/casos_no_validados.json")
  ]);

  // Normalizamos los nombres de campos para que coincidan
  const normalizadosValidados = validados.map(c => ({
    nombre: c.Nombre || c["Nombre"] || c["Nombre "] || "No especificado",
    edad: c.Edad || c["Edad "] || "No especificado",
    genero: c.Género || c["Género"] || c["Género "] || "No especificado",
    localizacion: c.Localizacion || c.Localización || c["Localización"] || "No especificada",
    pruebas: c["Pruebas realizadas"] || c["Pruebas realizadas  (ej: array genético, EEG, resonancia)  "] || "No especificadas",
    sintomas: c["síntomas principales"] || c["síntomas principales  "] || "No especificados",
    gravedad: c["Nivel de afectación"] || "No especificado",
    medicamentos: c["Medicamentos actuales/pasados"] || c["Medicamentos actuales/pasados\n (ej: risperidona, magnesio):  "] || "No especificado",
    terapias: c["Terapias recibidas"] || c["Terapias recibidas\n(logopedia, psicoterapia, etc.):  "] || "No especificado",
    desafios: c["Necesidades y Desafíos"] || c[" Necesidades y Desafíos"] || "No especificado",
    __origen: "validado"
  }));

  const normalizadosNoValidados = noValidados.map(c => ({
    nombre: c.Nombre || "No especificado",
    edad: c.Edad || c["Edad"] || "No especificado",
    genero: c.Género || "No especificado",
    localizacion: c.Localizacion || "No especificada",
    pruebas: c["Pruebas realizadas"] || "No especificadas",
    sintomas: c["síntomas principales"] || "No especificados",
    gravedad: c["Nivel de afectación"] || "No especificado",
    medicamentos: c["Medicamentos actuales/pasados"] || "No especificado",
    terapias: c["Terapias recibidas"] || "No especificado",
    desafios: c["Necesidades y Desafíos"] || "No especificado",
    __origen: "no_validado"
  }));

  return [...normalizadosValidados, ...normalizadosNoValidados];
}

// ======================
// FUNCIONES DE UTILIDAD
// ======================
function pct(part, total) { 
  return total ? Math.round((part / total) * 100) : 0;
}

function gravBadge(g) {
  const s = (g || '').toLowerCase();
  if (s.includes('grave') || s.includes('sever')) return 'badge high';
  if (s.includes('moderad') || s.includes('medio')) return 'badge med';
  return 'badge ok';
}

function isSevereCase(gravedad) {
  const g = (gravedad || '').toLowerCase();
  return g.includes('grave') || g.includes('sever');
}

function humanAgeSex(r) {
  const edad = Number(r.edad) || 0;
  const esNino = edad < 18;
  
  if (r.genero === 'Masculino') return esNino ? 'niño' : 'hombre';
  if (r.genero === 'Femenino') return esNino ? 'niña' : 'mujer';
  return esNino ? 'menor' : 'persona adulta';
}
<!-- Agrega esta función en scripts.js -->
function optimizarImagenes() {
  document.querySelectorAll('img').forEach(img => {
    // Lazy loading nativo
    img.loading = 'lazy';
    
    // Agregar transición suave
    img.style.transition = 'opacity 0.3s ease';
    img.onload = function() {
      this.style.opacity = '1';
    };
    img.style.opacity = '0';
  });
}

// ======================
// NAVEGACIÓN
// ======================
function setActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  $all('nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === path);
  });
}

// ======================
// INICIALIZACIÓN
// ======================
document.addEventListener('DOMContentLoaded', setActiveNav);

// Función para optimizar imágenes
function optimizarImagenes() {
  document.querySelectorAll('img').forEach(img => {
    // Lazy loading nativo
    img.loading = 'lazy';
    
    // Agregar transición suave
    img.style.transition = 'opacity 0.3s ease';
    img.onload = function() {
      this.style.opacity = '1';
    };
    img.style.opacity = '0';
  });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  setActiveNav();
  optimizarImagenes();
});


