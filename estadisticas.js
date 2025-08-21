// estadisticas.js - Versión mejorada
async function initStats() {
  const data = await loadDataset();
  
  // Actualizar estadísticas generales
  document.getElementById('total-casos').textContent = data.length;
  
  const edadesValidas = data.map(r => Number(r.edad)).filter(e => e > 0);
  const edadPromedio = edadesValidas.length > 0 ? 
    Math.round(edadesValidas.reduce((a, b) => a + b, 0) / edadesValidas.length) : 0;
  document.getElementById('edad-promedio').textContent = edadPromedio;
  
  // Países únicos
  const paisesSet = new Set(
    data
      .map(c => (c.localizacion || "").trim())
      .filter(p => p && p.toLowerCase() !== "no especificada")
  );
  document.getElementById('paises-total').textContent = paisesSet.size;
  
  // Tasa de validación
  const validados = data.filter(r => r.__origen === 'validado').length;
  const tasaValidacion = data.length > 0 ? Math.round((validados / data.length) * 100) : 0;
  document.getElementById('validacion-rate').textContent = tasaValidacion + '%';

  // Gráfico de prevalencia de síntomas
  const defs = [
    ['TEA', /tea|autis|espectro autista/i],
    ['Hipotonía', /hipoton|tono muscular bajo/i],
    ['Disfagia', /disfagi|dificultad para tragar/i],
    ['Epilepsia', /epileps|convuls|risis/i],
    ['Cardiopatías', /cardiopat|corazón|cardíac/i],
    ['TDAH', /tdah|déficit de atención|hiperactividad/i]
  ];

  const counts = defs.map(([l, rx]) => data.filter(r => rx.test(r.sintomas || '')).length);

  new Chart(document.getElementById('chartPrev').getContext('2d'), {
    type: 'bar',
    data: {
      labels: defs.map(d => d[0]),
      datasets: [{
        label: 'Pacientes',
        data: counts,
        backgroundColor: 'rgba(110, 168, 254, 0.6)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Número de casos'
          }
        }
      }
    }
  });

  // Gráfico de distribución por sexo
  const hombres = data.filter(r => 
    (r.genero || '').toUpperCase() === 'MASCULINO' || 
    (r.genero || '').toUpperCase() === 'M'
  ).length;
  
  const mujeres = data.filter(r => 
    (r.genero || '').toUpperCase() === 'FEMENINO' || 
    (r.genero || '').toUpperCase() === 'F'
  ).length;

  new Chart(document.getElementById('chartSexo').getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['Masculino', 'Femenino'],
      datasets: [{
        data: [hombres, mujeres],
        backgroundColor: [
          'rgba(110, 168, 254, 0.6)',
          'rgba(255, 107, 107, 0.6)'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });

  // Gráfico de distribución por edad
  const bucketsEdad = {
    "0-5 años": 0,
    "6-12 años": 0,
    "13-18 años": 0,
    "19+ años": 0,
    "No especificada": 0
  };

  data.forEach(c => {
    const edad = parseInt(c.edad);
    if (!isNaN(edad)) {
      if (edad <= 5) bucketsEdad["0-5 años"]++;
      else if (edad <= 12) bucketsEdad["6-12 años"]++;
      else if (edad <= 18) bucketsEdad["13-18 años"]++;
      else bucketsEdad["19+ años"]++;
    } else {
      bucketsEdad["No especificada"]++;
    }
  });

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
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Número de casos'
          }
        }
      }
    }
  });

  // Mapa de países
  const paisesContainer = document.getElementById('paises-container');
  if (paisesContainer) {
    // Contar casos por país detectado
    const paisesCount = {};
    data.forEach(c => {
      const lugar = (c.localizacion || "").trim();
      if (lugar && lugar.toLowerCase() !== "no especificada") {
        const pais = detectarPais(lugar);
        paisesCount[pais] = (paisesCount[pais] || 0) + 1;
      }
    });

    // Ordenar por número de casos
    const paisesOrdenados = Object.entries(paisesCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);

    if (paisesOrdenados.length > 0) {
      paisesContainer.innerHTML = paisesOrdenados.map(([pais, count]) => {
        const bandera = getBandera(pais);
        const nombrePais = pais.charAt(0).toUpperCase() + pais.slice(1);
        
        return `
          <div class="pais-card">
            <span class="bandera">${bandera}</span>
            <div class="pais-nombre">${nombrePais}</div>
            <div class="pais-casos">${count} caso${count !== 1 ? 's' : ''}</div>
          </div>
        `;
      }).join('');
    }
  }

  // Gráfico de terapias (nuevo)
  const terapiasCommon = {
    'Lenguaje': /lenguaje|logopedia|fonoaudiología/i,
    'Fisioterapia': /fisioterapia|terapia física/i,
    'Ocupacional': /ocupacional|integracion sensorial/i,
    'Conductual': /conductual|aba|análisis aplicado/i,
    'Psicología': /psicología|psicoterapia/i,
    'Educativa': /educativa|pedagógica|apoyo escolar/i
  };

  const countsTerapias = Object.entries(terapiasCommon).map(([name, regex]) => 
    data.filter(r => regex.test(r.terapias || '')).length
  );

  const chartTerapias = document.getElementById('chartTerapias');
  if (chartTerapias) {
    new Chart(chartTerapias.getContext('2d'), {
      type: 'bar',
      data: {
        labels: Object.keys(terapiasCommon),
        datasets: [{
          label: 'Pacientes',
          data: countsTerapias,
          backgroundColor: 'rgba(99, 230, 190, 0.6)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de casos'
            }
          }
        }
      }
    });
  }

  // Gráfico de gravedad (nuevo)
  const nivelesGravedad = {
    'Leve': /leve|ligero|minor/i,
    'Moderado': /moderado|medio|moderate/i,
    'Severo': /severo|grave|sever|strong/i
  };

  const countsGravedad = Object.entries(nivelesGravedad).map(([name, regex]) =>
    data.filter(r => regex.test(r.gravedad || '')).length
  );

  const chartGravedad = document.getElementById('chartGravedad');
  if (chartGravedad) {
    new Chart(chartGravedad.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: Object.keys(nivelesGravedad),
        datasets: [{
          data: countsGravedad,
          backgroundColor: [
            'rgba(99, 230, 190, 0.6)', // Leve - verde
            'rgba(255, 212, 59, 0.6)', // Moderado - amarillo
            'rgba(255, 107, 107, 0.6)'  // Severo - rojo
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
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

// Funciones auxiliares (las mismas que en index.js)
function getBandera(pais) {
  const paisLimpio = pais.toLowerCase().replace(/[^a-záéíóúüñ\s]/g, '').trim();
  
  const banderas = {
    'españa': '🇪🇸', 'espana': '🇪🇸', 'spain': '🇪🇸', 'andalucía': '🇪🇸', 'andalucia': '🇪🇸', 'malaga': '🇪🇸',
    'argentina': '🇦🇷', 'honduras': '🇭🇳', 'méxico': '🇲🇽', 'mexico': '🇲🇽', 'colombia': '🇨🇴', 'chile': '🇨🇱',
    'default': '🌍'
  };

  for (const [key, bandera] of Object.entries(banderas)) {
    if (paisLimpio.includes(key) || key.includes(paisLimpio)) return bandera;
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
// estadisticas.js - Agregar estas funciones al FINAL del archivo

// Función para obtener bandera por país
function getBandera(pais) {
  if (!pais) return '🌍';
  
  const paisLimpio = pais.toLowerCase()
    .replace(/[^a-záéíóúüñ\s]/g, '')
    .trim();
  
  const banderas = {
    // España y variantes
    'españa': '🇪🇸', 'espana': '🇪🇸', 'spain': '🇪🇸',
    'andalucía': '🇪🇸', 'andalucia': '🇪🇸', 'malaga': '🇪🇸',
    'madrid': '🇪🇸', 'barcelona': '🇪🇸', 'valencia': '🇪🇸',
    'sevilla': '🇪🇸', 'bilbao': '🇪🇸', 'granada': '🇪🇸',
    
    // Latinoamérica
    'argentina': '🇦🇷', 'buenos aires': '🇦🇷', 'córdoba': '🇦🇷',
    'honduras': '🇭🇳', 'tegucigalpa': '🇭🇳',
    'méxico': '🇲🇽', 'mexico': '🇲🇽', 'cdmx': '🇲🇽',
    'colombia': '🇨🇴', 'bogota': '🇨🇴', 'medellin': '🇨🇴',
    'chile': '🇨🇱', 'santiago': '🇨🇱',
    'perú': '🇵🇪', 'peru': '🇵🇪', 'lima': '🇵🇪',
    'venezuela': '🇻🇪', 'caracas': '🇻🇪',
    
    'default': '🌍'
  };

  // Buscar coincidencias
  for (const [key, bandera] of Object.entries(banderas)) {
    if (paisLimpio.includes(key)) {
      return bandera;
    }
  }
  
  return banderas.default;
}

// Función para detectar el país desde una ciudad/región
function detectarPais(lugar) {
  if (!lugar) return 'Desconocido';
  
  const lugarLower = lugar.toLowerCase();
  
  const paises = {
    'españa': ['malaga', 'málaga', 'madrid', 'barcelona', 'valencia', 'sevilla'],
    'argentina': ['buenos aires', 'córdoba', 'rosario', 'mendoza'],
    'honduras': ['tegucigalpa', 'san pedro sula', 'la ceiba'],
    'méxico': ['ciudad de méxico', 'cdmx', 'guadalajara', 'monterrey'],
    'colombia': ['bogotá', 'bogota', 'medellín', 'medellin', 'cali'],
    'chile': ['santiago', 'valparaíso'],
    'default': lugar
  };
  
  // Buscar si el lugar contiene una ciudad de algún país
  for (const [pais, ciudades] of Object.entries(paises)) {
    if (ciudades.some(ciudad => lugarLower.includes(ciudad))) {
      return pais;
    }
  }
  
  return lugar;
}
// estadisticas.js - Agregar estas funciones al FINAL del archivo

// Función para obtener bandera por país
function getBandera(pais) {
  if (!pais) return '🌍';
  
  const paisLimpio = pais.toLowerCase()
    .replace(/[^a-záéíóúüñ\s]/g, '')
    .trim();
  
  const banderas = {
    // España y variantes
    'españa': '🇪🇸', 'espana': '🇪🇸', 'spain': '🇪🇸',
    'andalucía': '🇪🇸', 'andalucia': '🇪🇸', 'malaga': '🇪🇸',
    'madrid': '🇪🇸', 'barcelona': '🇪🇸', 'valencia': '🇪🇸',
    'sevilla': '🇪🇸', 'bilbao': '🇪🇸', 'granada': '🇪🇸',
    
    // Latinoamérica
    'argentina': '🇦🇷', 'buenos aires': '🇦🇷', 'córdoba': '🇦🇷',
    'honduras': '🇭🇳', 'tegucigalpa': '🇭🇳',
    'méxico': '🇲🇽', 'mexico': '🇲🇽', 'cdmx': '🇲🇽',
    'colombia': '🇨🇴', 'bogota': '🇨🇴', 'medellin': '🇨🇴',
    'chile': '🇨🇱', 'santiago': '🇨🇱',
    'perú': '🇵🇪', 'peru': '🇵🇪', 'lima': '🇵🇪',
    'venezuela': '🇻🇪', 'caracas': '🇻🇪',
    
    'default': '🌍'
  };

  // Buscar coincidencias
  for (const [key, bandera] of Object.entries(banderas)) {
    if (paisLimpio.includes(key)) {
      return bandera;
    }
  }
  
  return banderas.default;
}

// Función para detectar el país desde una ciudad/región
function detectarPais(lugar) {
  if (!lugar) return 'Desconocido';
  
  const lugarLower = lugar.toLowerCase();
  
  const paises = {
    'españa': ['malaga', 'málaga', 'madrid', 'barcelona', 'valencia', 'sevilla'],
    'argentina': ['buenos aires', 'córdoba', 'rosario', 'mendoza'],
    'honduras': ['tegucigalpa', 'san pedro sula', 'la ceiba'],
    'méxico': ['ciudad de méxico', 'cdmx', 'guadalajara', 'monterrey'],
    'colombia': ['bogotá', 'bogota', 'medellín', 'medellin', 'cali'],
    'chile': ['santiago', 'valparaíso'],
    'default': lugar
  };
  
  // Buscar si el lugar contiene una ciudad de algún país
  for (const [pais, ciudades] of Object.entries(paises)) {
    if (ciudades.some(ciudad => lugarLower.includes(ciudad))) {
      return pais;
    }
  }
  
  return lugar;
}
