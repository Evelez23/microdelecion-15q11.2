// resumen.js - Versión CORREGIDA y completa
async function initResumen() {
  const data = await loadDataset();
  
  // Actualizar KPIs rápidos
  document.getElementById('total-pacientes').textContent = data.length;
  
  const edadesValidas = data.map(r => Number(r.edad)).filter(e => e > 0);
  const edadPromedio = edadesValidas.length > 0 ? 
    Math.round(edadesValidas.reduce((a, b) => a + b, 0) / edadesValidas.length) : 0;
  document.getElementById('edad-promedio').textContent = edadPromedio + ' años';
  
  const casosTEA = data.filter(r => (r.sintomas || '').toLowerCase().includes('tea')).length;
  const porcentajeTEA = data.length > 0 ? Math.round((casosTEA / data.length) * 100) : 0;
  document.getElementById('sintoma-comun').textContent = porcentajeTEA + '%';
  
  // Contar terapias únicas
  const todasTerapias = data
    .map(r => (r.terapias || '').toLowerCase())
    .filter(t => t && t !== 'no especificado')
    .join(';')
    .split(';')
    .map(t => t.trim())
    .filter(t => t.length > 0);
  
  const terapiasUnicas = new Set(todasTerapias);
  document.getElementById('terapias-comunes').textContent = terapiasUnicas.size + '+';

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

  // Gráfico de edades
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
          }
        }
      }
    });
  }

  // Gráfico de síntomas
  const symptomsCtx = document.getElementById('chartSymptoms');
  if (symptomsCtx) {
    const keys = ['tea','hipoton','disfagi','epileps','cardiopat','tdah'];
    const labels = ['TEA','Hipotonía','Disfagia','Epilepsia','Cardiopatías','TDAH'];
    const counts = keys.map(k => data.filter(r => (r.sintomas || '').toLowerCase().includes(k)).length);

    new Chart(symptomsCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Número de casos',
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
  }

  // Gráfico de origen
  const origenCtx = document.getElementById('chartOrigenResumen');
  if (origenCtx) {
    const total = data.length;
    const val = data.filter(r => r.__origen === 'validado').length;
    const nov = total - val;

    new Chart(origenCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Validados','Sin validar'],
        datasets: [{
          data: [val, nov],
          backgroundColor: ['#63e6be', '#ffd43b']
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
