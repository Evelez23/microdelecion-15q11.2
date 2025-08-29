<script>
// Versión mejorada del código JavaScript
async function loadDataset() {
  // Esta función debería cargar tus datos reales
  try {
    const response = await fetch('ruta/a/tus/datos.json'); // Cambia por tu ruta real
    return await response.json();
  } catch (error) {
    console.error('Error cargando datos, usando datos de ejemplo:', error);
    // Datos de ejemplo para prueba
    return [
      { __origen: "validado", localizacion: "Madrid, España", edad: "5" },
      { __origen: "validado", localizacion: "Barcelona, España", edad: "8" },
      { __origen: "no_validado", localizacion: "Buenos Aires, Argentina", edad: "12" },
      { __origen: "validado", localizacion: "Ciudad de México, México", edad: "3" },
      { __origen: "validado", localizacion: "No especificada", edad: "15" },
      { __origen: "no_validado", localizacion: "Lima, Perú", edad: "7" },
      { __origen: "validado", localizacion: "Santiago, Chile", edad: "19" },
      { __origen: "validado", localizacion: "New York, USA", edad: "22" },
      { __origen: "validado", localizacion: "París, Francia", edad: "6" },
      { __origen: "validado", localizacion: "Roma, Italia", edad: "10" },
      { __origen: "no_validado", localizacion: "Berlín, Alemania", edad: "14" },
      { __origen: "validado", localizacion: "Tokio, Japón", edad: "9" },
      { __origen: "validado", localizacion: "No especificada", edad: "" }
    ];
  }
}

async function initIndex() {
  const data = await loadDataset();

  // ---- KPIs ----
  const total = data.length;
  const validados = data.filter(c => c.__origen === "validado").length;
  const noValidados = data.filter(c => c.__origen === "no_validado").length;

  // Países / localización distintos (excluyendo "No especificada")
  const paisesUnicos = new Set();
  
  data.forEach(c => {
    const lugar = (c.localizacion || "").trim();
    if (lugar && lugar.toLowerCase() !== "no especificada") {
      const pais = detectarPais(lugar);
      if (pais && pais !== "Desconocido") {
        paisesUnicos.add(pais);
      }
    }
  });

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
        <h2>${paisesUnicos.size}</h2>
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
          backgroundColor: "#6ea8fe"
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
        if (pais && pais !== "Desconocido") {
          paisesCount[pais] = (paisesCount[pais] || 0) + 1;
        }
      }
    });

    // Ordenar por número de casos
    const paisesOrdenados = Object.entries(paisesCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12); // Top 12 países

    if (paisesOrdenados.length > 0) {
      paisesContainer.innerHTML = paisesOrdenados.map(([pais, count]) => {
        const bandera = getBandera(pais);
        const nombrePais = formatearNombrePais(pais);
        
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

// Función para formatear el nombre del país
function formatearNombrePais(pais) {
  const formatoEspecial = {
    'usa': 'EE.UU.',
    'estados unidos': 'EE.UU.',
    'reino unido': 'Reino Unido',
    'espana': 'España',
    'mexico': 'México',
    'peru': 'Perú',
    'japon': 'Japón'
  };
  
  return formatoEspecial[pais.toLowerCase()] || 
         pais.charAt(0).toUpperCase() + pais.slice(1);
}

// Función para obtener bandera por país
function getBandera(pais) {
  const paisNormalizado = pais.toLowerCase().trim();
  
  const banderas = {
    // España y variantes
    'españa': '🇪🇸', 'espana': '🇪🇸', 'spain': '🇪🇸',
    
    // Latinoamérica
    'argentina': '🇦🇷',
    'honduras': '🇭🇳',
    'méxico': '🇲🇽', 'mexico': '🇲🇽',
    'colombia': '🇨🇴',
    'chile': '🇨🇱',
    'perú': '🇵🇪', 'peru': '🇵🇪',
    'venezuela': '🇻🇪',
    'ecuador': '🇪🇨',
    'uruguay': '🇺🇾',
    'brasil': '🇧🇷',
    
    // Resto del mundo
    'estados unidos': '🇺🇸', 'usa': '🇺🇸', 'eeuu': '🇺🇸',
    'canadá': '🇨🇦', 'canada': '🇨🇦',
    'francia': '🇫🇷',
    'italia': '🇮🇹',
    'alemania': '🇩🇪',
    'reino unido': '🇬🇧', 'inglaterra': '🇬🇧',
    'japón': '🇯🇵', 'japon': '🇯🇵',
    
    'default': '🌍'
  };

  return banderas[paisNormalizado] || banderas.default;
}

// Función mejorada para detectar el país desde una ciudad/región
function detectarPais(lugar) {
  if (!lugar || lugar.toLowerCase() === "no especificada") return 'Desconocido';
  
  const lugarLower = lugar.toLowerCase();
  
  // Lista de países a detectar (prioridad a coincidencias exactas)
  const paises = [
    'españa', 'espana', 'spain', 'argentina', 'honduras', 
    'méxico', 'mexico', 'colombia', 'chile', 'perú', 'peru',
    'venezuela', 'ecuador', 'uruguay', 'brasil', 'estados unidos',
    'usa', 'eeuu', 'canadá', 'canada', 'francia', 'italia', 
    'alemania', 'reino unido', 'inglaterra', 'japón', 'japon'
  ];
  
  // Primero buscar el nombre completo del país
  for (const pais of paises) {
    if (lugarLower.includes(pais)) {
      return pais;
    }
  }
  
  // Si no encontramos país directamente, buscar por ciudades/regiones
  const mappingCiudades = {
    // España
    'madrid': 'españa', 'barcelona': 'españa', 'valencia': 'españa',
    'sevilla': 'españa', 'bilbao': 'españa', 'granada': 'españa',
    'alicante': 'españa', 'murcia': 'españa', 'zaragoza': 'españa',
    'segovia': 'españa', 'málaga': 'españa', 'malaga': 'españa',
    
    // Argentina
    'buenos aires': 'argentina', 'córdoba': 'argentina', 'rosario': 'argentina',
    'mendoza': 'argentina', 'caba': 'argentina',
    
    // México
    'ciudad de méxico': 'méxico', 'cdmx': 'méxico', 'guadalajara': 'méxico',
    'monterrey': 'méxico', 'cancún': 'méxico', 'cancun': 'méxico',
    
    // Resto de países
    'lima': 'perú', 'callao': 'perú', 'cusco': 'perú',
    'santiago': 'chile', 'valparaíso': 'chile', 'valparaiso': 'chile',
    'viña del mar': 'chile', 'viña del mar': 'chile',
    'new york': 'estados unidos', 'los angeles': 'estados unidos',
    'chicago': 'estados unidos', 'miami': 'estados unidos',
    'texas': 'estados unidos', 'florida': 'estados unidos',
    'california': 'estados unidos',
    'parís': 'francia', 'paris': 'francia', 'lyon': 'francia',
    'marsella': 'francia',
    'roma': 'italia', 'milán': 'italia', 'milan': 'italia',
    'venecia': 'italia', 'florencia': 'italia',
    'berlín': 'alemania', 'berlin': 'alemania', 'múnich': 'alemania',
    'munich': 'alemania', 'hamburgo': 'alemania',
    'londres': 'reino unido', 'manchester': 'reino unido',
    'liverpool': 'reino unido', 'edimburgo': 'reino unido',
    'tokio': 'japón', 'osaka': 'japón', 'kyoto': 'japón'
  };
  
  // Buscar coincidencias de ciudades
  for (const [ciudad, pais] of Object.entries(mappingCiudades)) {
    if (lugarLower.includes(ciudad)) {
      return pais;
    }
  }
  
  // Si no encontramos nada, devolver "Desconocido"
  return 'Desconocido';
}

document.addEventListener("DOMContentLoaded", initIndex);
</script>
