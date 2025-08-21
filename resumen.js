// resumen.js - Versión mejorada
async function initResumen() {
  const data = await loadDataset();
  
  // Distribución por grupos de edad
  const buckets = { 
    '0-5 años': 0, 
    '6-10 años': 0, 
    '11-15 años': 0, 
    '16+ años': 0,
    'No especificada': 0
  };

  data.forEach(r => {
    const e = Number(r.edad) || 0;
    if (e === 0) {
      buckets['No especificada']++;
    } else if (e <= 5) {
      buckets['0-5 años']++;
    } else if (e <= 10) {
      buckets['6-10 años']++;
    } else if (e <= 15) {
      buckets['11-15 años']++;
    } else {
      buckets['16+ años']++;
    }
  });

  // Gráfico de distribución por edades
  const agePieCtx = document.getElementById('chartAgePie');
  if (agePieCtx) {
    new Chart(agePieCtx.getContext('2d'), {
      type: 'pie',
      data: {
        labels: Object.keys(buckets),
        datasets: [{
          data: Object.values(buckets),
          backgroundColor: [
            'rgba(110, 168, 254, 0.6)',
            'rgba(0, 209, 209, 0.6)',
            'rgba(255, 212, 59, 0.6)',
            'rgba(255, 107, 107, 0.6)',
            'rgba(168, 179, 207, 0.6)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  // Gráfico de síntomas principales
  const symptomsCtx = document.getElementById('chartSymptoms');
  if (symptomsCtx) {
    const keys = ['tea', 'hipoton', 'disfagi', 'epileps', 'cardiopat', 'tdah'];
    const labels = ['TEA', 'Hipotonía', 'Disfagia', 'Epilepsia', 'Cardiopatías', 'TDAH'];
    const counts = keys.map(k => data.filter(r => (r.sintomas || '').toLowerCase().includes(k)).length);

    new Chart(symptomsCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Número de casos',
          data: counts,
          backgroundColor: 'rgba(110, 168, 254, 0.6)',
          borderColor: 'rgba(110, 168, 254, 1)',
          borderWidth: 1
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
          },
          x: {
            title: {
              display: true,
              text: 'Síntomas'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Casos: ${context.raw}`;
              }
            }
          }
        }
      }
    });
  }

  // Gráfico de origen (validados vs no validados)
  const origenCtx = document.getElementById('chartOrigenResumen');
  if (origenCtx) {
    const total = data.length;
    const val = data.filter(r => r.__origen === 'validado').length;
    const nov = total - val;

    new Chart(origenCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Validados', 'Sin validar'],
        datasets: [{
          data: [val, nov],
          backgroundColor: ['#63e6be', '#ffd43b'],
          borderColor: ['#4abd9d', '#d4b332'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  // Estadísticas adicionales para resumen
  const statsContainer = document.getElementById('stats-container');
  if (statsContainer) {
    // Calcular estadísticas adicionales
    const edades = data.map(r => Number(r.edad)).filter(edad => !isNaN(edad) && edad > 0);
    const edadPromedio = edades.length > 0 ? Math.round(edades.reduce((a, b) => a + b, 0) / edades.length) : 0;
    
    const paisesUnicos = new Set(
      data
        .map(c => (c.localizacion || "").trim())
        .filter(p => p && p.toLowerCase() !== "no especificada")
    );
    
    const casosGraves = data.filter(r => {
      const gravedad = (r.gravedad || '').toLowerCase();
      return gravedad.includes('sever') || gravedad.includes('grave');
    }).length;

    statsContainer.innerHTML = `
      <div class="grid-2">
        <div class="panel">
          <h3>Edad promedio</h3>
          <p class="stat-number">${edadPromedio} años</p>
        </div>
        <div class="panel">
          <h3>Países con casos</h3>
          <p class="stat-number">${paisesUnicos.size}</p>
        </div>
        <div class="panel">
          <h3>Casos graves</h3>
          <p class="stat-number">${casosGraves}</p>
        </div>
        <div class="panel">
          <h3>Total de casos</h3>
          <p class="stat-number">${data.length}</p>
        </div>
      </div>
    `;
  }

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

document.addEventListener('DOMContentLoaded', initResumen);
