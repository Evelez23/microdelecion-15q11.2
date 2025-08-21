// index.js
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

  // Chart: estado (validados vs no validados)
  const origenEl = document.getElementById("chartOrigen");
  if (origenEl) {
    const ctxOrigen = origenEl.getContext("2d");
    new Chart(ctxOrigen, {
      type: "doughnut",
      data: {
        labels: ["Validados", "No validados"],
        datasets: [{
          data: [validados, noValidados],
          backgroundColor: ["#59a14f", "#e15759"]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } }
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

document.addEventListener("DOMContentLoaded", initIndex);
