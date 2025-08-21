// index.js - Versión completa con mapa de países
async function initIndex() {
  const data = await loadDataset();

  // ---- KPIs ----
  const total = data.length;
  const validados = data.filter(c => c.__origen === "validado").length;
  const noValidados = data.filter(c => c.__origen === "no_validado").length;

  // Países / localización distintos (excluyendo "No especificada")
  const paisesSet = new Set(
    data
      .map(c => (c.localizacion || "").trim())
      .filter(p => p && p.toLowerCase() !== "no especificada")
  );

  // Render de KPIs
  const kpiContainer = document.getElementById("kpis");
  if (kpiContainer) {
    kpiContainer.innerHTML = `
      <div class="panel kpi">
        <h2>${total}</h2>
        <p>Total de casos</p>
      </div>
      <div class="panel kpi">
        <h2>${validados}</h2>
        <p>Casos validados</p>
      </div>
      <div class="panel kpi">
        <h2>${noValidados}</h2>
        <p>Casos no validados</p>
      </div>
      <div class="panel kpi">
        <h2>${paisesSet.size}</h2>
        <p>Países con casos</p>
      </div>
    `;
  }

  // ---- Distribución por edades ----
  const buckets = {
    "0-5": 0,
    "6-12": 0,
    "13-18": 0,
    "19+": 0,
    "No especificada": 0
  };

  data.forEach(c => {
    const edad = parseInt(c.edad);
    if (!isNaN(edad)) {
      if (edad <= 5) buckets["0-5"]++;
      else if (edad <= 12) buckets["6-12"]++;
      else if (edad <= 18) buckets["13-18"]++;
      else buckets["19+"]++;
    } else {
      buckets["No especificada"]++;
    }
  });

  // Chart: edades
  const agesEl = document.getElementById("chartAges");
  if (agesEl) {
    const ctxAges = agesEl.getContext("2d");
    new Chart(ctxAges, {
      type: "bar",
      data: {
        labels: Object.keys(buckets),
        datasets: [{
          label: "Número de casos",
          data: Object.values(buckets),
          backgroundColor: "#4e79a7"
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }

  // ---- Mapa de países ----
  const paisesContainer = document.getElementById("paises-container");
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
      .slice(0, 12); // Top 12 países

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
    } else {
      paisesContainer.innerHTML = '<div class="pais-loading">No hay datos de países disponibles</div>';
    }
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

// Función para obtener bandera por país
function getBandera(pais) {
  // Limpiar y normalizar el texto del país
  const paisLimpio = pais.toLowerCase()
    .replace(/[^a-záéíóúüñ\s]/g, '') // Eliminar caracteres especiales
    .trim();
  
  const banderas = {
    // España y variantes
    'españa': '🇪🇸', 'espana': '🇪🇸', 'spain': '🇪🇸',
    'andalucía': '🇪🇸', 'andalucia': '🇪🇸', 'malaga': '🇪🇸',
    'madrid': '🇪🇸', 'barcelona': '🇪🇸', 'valencia': '🇪🇸',
    'sevilla': '🇪🇸', 'bilbao': '🇪🇸', 'granada': '🇪🇸','Segovia': '🇪🇸','Alicante': '🇪🇸','Zaragoza': '🇪🇸','Murcia': '🇪🇸',
    
    // Latinoamérica
    'argentina': '🇦🇷', 'buenos aires': '🇦🇷', 'córdoba': '🇦🇷',
    'honduras': '🇭🇳', 'tegucigalpa': '🇭🇳',
    'méxico': '🇲🇽', 'mexico': '🇲🇽', 'cdmx': '🇲🇽',
    'colombia': '🇨🇴', 'bogota': '🇨🇴', 'medellin': '🇨🇴',
    'chile': '🇨🇱', 'santiago': '🇨🇱',
    'perú': '🇵🇪', 'peru': '🇵🇪', 'lima': '🇵🇪',
    'venezuela': '🇻🇪', 'caracas': '🇻🇪',
    'ecuador': '🇪🇨', 'quito': '🇪🇨',
    'uruguay': '🇺🇾', 'montevideo': '🇺🇾',
    
    // Resto del mundo
    'estados unidos': '🇺🇸', 'usa': '🇺🇸', 'eeuu': '🇺🇸',
    'canadá': '🇨🇦', 'canada': '🇨🇦',
    'francia': '🇫🇷', 'paris': '🇫🇷',
    'italia': '🇮🇹', 'roma': '🇮🇹',
    
    'default': '🌍'
  };

  // Buscar coincidencias parciales
  for (const [key, bandera] of Object.entries(banderas)) {
    if (paisLimpio.includes(key) || key.includes(paisLimpio)) {
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
    'españa': ['malaga', 'málaga', 'madrid', 'barcelona', 'valencia', 'sevilla', 'bilbao', 'granada'],
    'argentina': ['buenos aires', 'córdoba', 'rosario', 'mendoza', 'caba'],
    'honduras': ['tegucigalpa', 'san pedro sula', 'la ceiba'],
    'méxico': ['ciudad de méxico', 'cdmx', 'guadalajara', 'monterrey', 'cancún'],
    'colombia': ['bogotá', 'bogota', 'medellín', 'medellin', 'cali', 'barranquilla'],
    'chile': ['santiago', 'valparaíso', 'viña del mar'],
    'perú': ['lima', 'callao', 'cusco'],
    'venezuela': ['caracas', 'maracaibo', 'valencia'],
    'estados unidos': ['new york', 'los angeles', 'chicago', 'miami', 'texas'],
    'francia': ['parís', 'paris', 'lyon', 'marsella'],
    'italia': ['roma', 'milán', 'milan', 'venecia']
  };
  
  // Buscar si el lugar contiene una ciudad de algún país
  for (const [pais, ciudades] of Object.entries(paises)) {
    if (ciudades.some(ciudad => lugarLower.includes(ciudad))) {
      return pais;
    }
  }
  
  // Si no encontramos ciudad, devolver el texto original
  return lugar;
}

// Función para acortar nombres largos
function acortarNombre(pais) {
  const acortamientos = {
    'estados unidos': 'EE.UU.',
    'reino unido': 'R.U.',
    'república dominicana': 'R.D.',
    'default': pais.length > 15 ? pais.substring(0, 12) + '...' : pais
  };

  const paisLower = pais.toLowerCase();
  return acortamientos[paisLower] || acortamientos.default;
}

document.addEventListener("DOMContentLoaded", initIndex);
