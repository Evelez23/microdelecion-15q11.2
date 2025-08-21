// estadisticas.js - Versión completa mejorada
async function initStats() {
  const data = await loadDataset();
  
  // Actualizar estadísticas generales
  document.getElementById('total-casos').textContent = data.length;
  document.getElementById('casos-validados').textContent = data.filter(r => r.__origen === 'validado').length;
  document.getElementById('casos-no-validados').textContent = data.filter(r => r.__origen === 'no_validado').length;
  
  // Países únicos (excluyendo "No especificada")
  const paisesSet = new Set(
    data
      .map(c => (c.localizacion || "").trim())
      .filter(p => p && p.toLowerCase() !== "no especificada")
  );
  document.getElementById('total-paises').textContent = paisesSet.size;

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
  const h = data.filter(r => (r.genero || '').toUpperCase() === 'MASCULINO' || (r.genero || '').toUpperCase() === 'M').length;
  const m = data.filter(r => (r.genero || '').toUpperCase() === 'FEMENINO' || (r.genero || '').toUpperCase() === 'F').length;

  new Chart(document.getElementById('chartSexo').getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['Masculino', 'Femenino'],
      datasets: [{
        data: [h, m],
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
  const buckets = {
    "0-5 años": 0,
    "6-12 años": 0,
    "13-18 años": 0,
    "19+ años": 0,
    "No especificada": 0
  };

  data.forEach(c => {
    const edad = parseInt(c.edad);
    if (!isNaN(edad)) {
      if (edad <= 5) buckets["0-5 años"]++;
      else if (edad <= 12) buckets["6-12 años"]++;
      else if (edad <= 18) buckets["13-18 años"]++;
      else buckets["19+ años"]++;
    } else {
      buckets["No especificada"]++;
    }
  });

  new Chart(document.getElementById('chartEdad').getContext('2d'), {
    type: 'bar',
    data: {
      labels: Object.keys(buckets),
      datasets: [{
        label: 'Número de casos',
        data: Object.values(buckets),
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

  // Animaciones
  if (window.anime) {
    anime({
      targets: '.panel',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(100),
      duration: 800,
      easing: 'easeOutQuad'
    });
  }
}

document.addEventListener('DOMContentLoaded', initStats);
