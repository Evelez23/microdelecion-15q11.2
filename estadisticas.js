// estadisticas.js - VERSIÓN DEFINITIVA CORREGIDA
async function initStats() {
  const data = await loadDataset();
  console.log('Datos cargados:', data); // Para debuggear

  // 1. KPIS PRINCIPALES (FUNCIONAN)
  document.getElementById('total-casos').textContent = data.length;
  
  const edadesValidas = data.map(r => {
    const edad = parseInt(r.edad || r.Edad || 0);
    return isNaN(edad) ? 0 : edad;
  }).filter(e => e > 0);
  
  const edadPromedio = edadesValidas.length > 0 ? 
    Math.round(edadesValidas.reduce((a, b) => a + b, 0) / edadesValidas.length) : 0;
  document.getElementById('edad-promedio').textContent = edadPromedio;

  // 2. DETECCIÓN INTELIGENTE DE CAMPOS
  const detectarCampo = (posiblesNombres) => {
    for (const nombre of posiblesNombres) {
      if (data[0] && data[0][nombre] !== undefined) {
        return nombre;
      }
    }
    return posiblesNombres[0]; // Fallback al primero
  };

  const campoGenero = detectarCampo(['genero', 'Género', 'sexo', 'Sexo']);
  const campoSintomas = detectarCampo(['sintomas', 'Síntomas', 'síntomas_principales']);
  const campoGravedad = detectarCampo(['gravedad', 'Gravedad', 'nivel_afectacion']);
  const campoTerapias = detectarCampo(['terapias', 'Terapias', 'terapias_recibidas']);
  const campoLocalizacion = detectarCampo(['localizacion', 'Localización', 'pais', 'País']);

  console.log('Campos detectados:', { campoGenero, campoSintomas, campoGravedad, campoTerapias, campoLocalizacion });

  // 3. GRÁFICO DE SÍNTOMAS (CORREGIDO)
  const sintomasConfig = [
    { key: 'tea', regex: /tea|autis|espectro autista|TEA/i },
    { key: 'hipotonia', regex: /hipoton|tono muscular bajo|hipotonía/i },
    { key: 'disfagia', regex: /disfagi|dificultad para tragar/i },
    { key: 'epilepsia', regex: /epileps|convuls|risis/i },
    { key: 'cardiopatia', regex: /cardiopat|corazón|cardíac/i },
    { key: 'tdah', regex: /tdah|déficit de atención|hiperactividad|TDAH/i }
  ];

  const countsSintomas = sintomasConfig.map(({ regex }) => 
    data.filter(r => regex.test(r[campoSintomas] || '')).length
  );

  if (document.getElementById('chartPrev')) {
    new Chart(document.getElementById('chartPrev').getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['TEA', 'Hipotonía', 'Disfagia', 'Epilepsia', 'Cardiopatías', 'TDAH'],
        datasets: [{
          label: 'Pacientes',
          data: countsSintomas,
          backgroundColor: 'rgba(110, 168, 254, 0.6)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Número de casos' } }
        }
      }
    });
  }

  // 4. GRÁFICO DE GÉNERO (CORREGIDO)
  const hombres = data.filter(r => 
    (r[campoGenero] || '').toLowerCase().includes('masc') || 
    (r[campoGenero] || '').toLowerCase().includes('hombre') ||
    (r[campoGenero] || '').toLowerCase() === 'm'
  ).length;

  const mujeres = data.filter(r => 
    (r[campoGenero] || '').toLowerCase().includes('femen') || 
    (r[campoGenero] || '').toLowerCase().includes('mujer') ||
    (r[campoGenero] || '').toLowerCase() === 'f'
  ).length;

  if (document.getElementById('chartSexo')) {
    new Chart(document.getElementById('chartSexo').getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Masculino', 'Femenino'],
        datasets: [{
          data: [hombres, mujeres],
          backgroundColor: ['rgba(110, 168, 254, 0.6)', 'rgba(255, 107, 107, 0.6)']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // 5. GRÁFICO DE EDAD (CORREGIDO)
  const bucketsEdad = { "0-5 años": 0, "6-12 años": 0, "13-18 años": 0, "19+ años": 0, "No especificada": 0 };

  data.forEach(r => {
    const edad = parseInt(r.edad || r.Edad || 0);
    if (!isNaN(edad) && edad > 0) {
      if (edad <= 5) bucketsEdad["0-5 años"]++;
      else if (edad <= 12) bucketsEdad["6-12 años"]++;
      else if (edad <= 18) bucketsEdad["13-18 años"]++;
      else bucketsEdad["19+ años"]++;
    } else {
      bucketsEdad["No especificada"]++;
    }
  });

  if (document.getElementById('chartEdad')) {
    new Chart(document.getElementById('chartEdad').getContext('2d'), {
      type: 'bar',
      data: {
        labels: Object.keys(bucketsEdad),
        datasets: [{
          label: 'Número de casos',
          data: Object.values(bucketsEdad),
          backgroundColor: 'rgba(0, 209, 209, 0.6)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Número de casos' } }
        }
      }
    });
  }

  // 6. PAÍSES (CORREGIDO)
  const paisesContainer = document.getElementById('paises-container');
  if (paisesContainer) {
    const paisesCount = {};
    data.forEach(r => {
      const lugar = (r[campoLocalizacion] || '').trim();
      if (lugar && !lugar.toLowerCase().includes('no especific')) {
        const pais = detectarPais(lugar);
        paisesCount[pais] = (paisesCount[pais] || 0) + 1;
      }
    });

    const paisesOrdenados = Object.entries(paisesCount).sort((a, b) => b[1] - a[1]).slice(0, 12);

    if (paisesOrdenados.length > 0) {
      paisesContainer.innerHTML = paisesOrdenados.map(([pais, count]) => `
        <div class="pais-card">
          <span class="bandera">${getBandera(pais)}</span>
          <div class="pais-nombre">${pais.charAt(0).toUpperCase() + pais.slice(1)}</div>
          <div class="pais-casos">${count} caso${count !== 1 ? 's' : ''}</div>
        </div>
      `).join('');
    }
  }

  // 7. TERAPIAS (CORREGIDO)
  const terapiasCommon = [
    { key: 'Lenguaje', regex: /lenguaje|logopedia|fonoaudiología/i },
    { key: 'Fisioterapia', regex: /fisioterapia|terapia física/i },
    { key: 'Ocupacional', regex: /ocupacional|integracion sensorial/i },
    { key: 'Conductual', regex: /conductual|aba|análisis aplicado/i }
  ];

  const countsTerapias = terapiasCommon.map(({ regex }) =>
    data.filter(r => regex.test(r[campoTerapias] || '')).length
  );

  if (document.getElementById('chartTerapias')) {
    new Chart(document.getElementById('chartTerapias').getContext('2d'), {
      type: 'bar',
      data: {
        labels: terapiasCommon.map(t => t.key),
        datasets: [{
          label: 'Pacientes',
          data: countsTerapias,
          backgroundColor: 'rgba(99, 230, 190, 0.6)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Número de casos' } }
        }
      }
    });
  }

  // 8. GRAVEDAD (CORREGIDO)
  const nivelesGravedad = [
    { key: 'Leve', regex: /leve|ligero|minor/i },
    { key: 'Moderado', regex: /moderado|medio/i },
    { key: 'Severo', regex: /severo|grave|sever/i }
  ];

  const countsGravedad = nivelesGravedad.map(({ regex }) =>
    data.filter(r => regex.test(r[campoGravedad] || '')).length
  );

  if (document.getElementById('chartGravedad')) {
    new Chart(document.getElementById('chartGravedad').getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: nivelesGravedad.map(n => n.key),
        datasets: [{
          data: countsGravedad,
          backgroundColor: ['rgba(99, 230, 190, 0.6)', 'rgba(255, 212, 59, 0.6)', 'rgba(255, 107, 107, 0.6)']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // Animaciones
  if (window.anime) {
    anime({
      targets: '.panel, .pais-card',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(100),
      duration: 800,
      easing: 'easeOutQuad'
    });
  }
}

// Funciones auxiliares (mantener igual)
function getBandera(pais) {
  const paisLimpio = pais.toLowerCase().replace(/[^a-záéíóúüñ\s]/g, '').trim();
  const banderas = {
    'españa': '🇪🇸', 'espana': '🇪🇸', 'spain': '🇪🇸', 'andalucía': '🇪🇸', 
    'andalucia': '🇪🇸', 'malaga': '🇪🇸', 'madrid': '🇪🇸', 'barcelona': '🇪🇸',
    'argentina': '🇦🇷', 'honduras': '🇭🇳', 'méxico': '🇲🇽', 'mexico': '🇲🇽',
    'colombia': '🇨🇴', 'chile': '🇨🇱', 'default': '🌍'
  };
  for (const [key, bandera] of Object.entries(banderas)) {
    if (paisLimpio.includes(key)) return bandera;
  }
  return banderas.default;
}

function detectarPais(lugar) {
  if (!lugar) return 'Desconocido';
  const lugarLower = lugar.toLowerCase();
  const paises = {
    'españa': ['malaga', 'málaga', 'madrid', 'barcelona'],
    'argentina': ['buenos aires', 'córdoba'],
    'honduras': ['tegucigalpa', 'san pedro sula'],
    'default': lugar
  };
  for (const [pais, ciudades] of Object.entries(paises)) {
    if (ciudades.some(ciudad => lugarLower.includes(ciudad))) return pais;
  }
  return paises.default;
}

document.addEventListener('DOMContentLoaded', initStats);
