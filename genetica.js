 // genetica.js - Versión completa mejorada
async function initGen() {
  // Gráfico de genes
  new Chart(document.getElementById('chartGenes').getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['CYFIP1', 'NIPA1', 'NIPA2', 'TUBGCP5'],
      datasets: [{
        label: 'Frecuencia de alteraciones',
        data: [85, 60, 45, 30],
        backgroundColor: [
          'rgba(110, 168, 254, 0.6)',
          'rgba(0, 209, 209, 0.6)',
          'rgba(99, 230, 190, 0.6)',
          'rgba(255, 212, 59, 0.6)'
        ]
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Porcentaje de casos'
          }
        }
      }
    }
  });

  // Gráfico de herencia
  new Chart(document.getElementById('chartHerencia').getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Heredado', 'De novo', 'Desconocido'],
      datasets: [{
        data: [30, 65, 5],
        backgroundColor: [
          'rgba(110, 168, 254, 0.6)',
          'rgba(0, 209, 209, 0.6)',
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

document.addEventListener('DOMContentLoaded', initGen);
