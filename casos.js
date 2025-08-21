// casos.js - Versión mejorada
async function initCasos() {
  const data = await loadDataset();

  const contValidados = document.getElementById('casos-validados-container');
  const contNoValidados = document.getElementById('casos-no-validados-container');
  const searchInput = document.getElementById('search');
  const filtroGenero = document.getElementById('filtro-genero');
  const filtroGravedad = document.getElementById('filtro-gravedad');
  const btnLimpiar = document.getElementById('btn-limpiar');
  const filtrosActivos = document.getElementById('filtros-activos');
  const totalCasosElem = document.getElementById('total-casos');
  const casosValidadosElem = document.getElementById('casos-validados');
  const casosNoValidadosElem = document.getElementById('casos-no-validados');

  // Helper → icono según género y edad
  function iconoGeneroEdad(genero, edad) {
    if (!genero) return "👤";
    const g = genero.toLowerCase();
    if (g.startsWith("m")) return edad && edad < 18 ? "👦" : "👨";
    if (g.startsWith("f")) return edad && edad < 18 ? "👧" : "👩";
    return "👤";
  }

  // Helper → listas con viñetas si hay ";"
  function formatearLista(texto) {
    if (!texto || texto === "No especificado") return "No especificado";
    if (texto.includes(";")) {
      const items = texto.split(";").map(t => t.trim()).filter(t => t.length > 0);
      return "<ul>" + items.map(i => `<li>${i}</li>`).join("") + "</ul>";
    }
    return texto;
  }

  // Actualizar estadísticas de resultados
  function actualizarEstadisticas(validados, noValidados) {
    totalCasosElem.textContent = validados.length + noValidados.length;
    casosValidadosElem.textContent = validados.length;
    casosNoValidadosElem.textContent = noValidados.length;
  }

  // Mostrar filtros activos
  function actualizarFiltrosActivos() {
    const filtros = [];
    
    if (searchInput.value) {
      filtros.push(`Búsqueda: "${searchInput.value}"`);
    }
    
    if (filtroGenero.value) {
      const generoText = filtroGenero.value === 'm' ? 'Masculino' : 'Femenino';
      filtros.push(`Género: ${generoText}`);
    }
    
    if (filtroGravedad.value) {
      const gravedadText = filtroGravedad.value.charAt(0).toUpperCase() + filtroGravedad.value.slice(1);
      filtros.push(`Gravedad: ${gravedadText}`);
    }
    
    if (filtros.length > 0) {
      filtrosActivos.innerHTML = `
        <div class="panel">
          <h3>Filtros aplicados:</h3>
          <div class="filtros-lista">
            ${filtros.map(f => `<span class="filtro-tag">${f}</span>`).join('')}
          </div>
        </div>
      `;
    } else {
      filtrosActivos.innerHTML = '';
    }
  }

  function renderCasos(casos, container) {
    container.innerHTML = '';

    if (casos.length === 0) {
      container.innerHTML = `
        <div class="panel" style="grid-column:1/-1">
          <p>No se encontraron casos que coincidan con la búsqueda</p>
        </div>
      `;
      return;
    }

    const casosHTML = casos.map((caso, i) => `
      <div class="panel caso-panel">
        <div class="panel-header toggle" data-id="${i}">
          <div class="panel-title">
            <h3>${iconoGeneroEdad(caso.genero, caso.edad)} ${caso.nombre || 'Nombre no disponible'}</h3>
            <span class="${gravBadge(caso.gravedad)}">${caso.gravedad || 'No especificado'}</span>
          </div>
          <span class="arrow">▶</span>
        </div>
        <div class="panel-body">
          <div class="grid-2">
            <div>
              <p><strong>Nivel de afectación:</strong> ${caso.gravedad || 'No especificado'}</p>
              <p><strong>Edad:</strong> ${caso.edad || 'No especificado'} años</p>
              <p><strong>Género:</strong> ${caso.genero || 'No especificado'}</p>
              <p><strong>Ubicación:</strong> ${caso.localizacion || 'No especificada'}</p>
            </div>
            <div>
              <p><strong>Pruebas realizadas:</strong> ${formatearLista(caso.pruebas)}</p>
              <p><strong>Síntomas:</strong> ${formatearLista(caso.sintomas)}</p>
            </div>
          </div>
          <div class="grid-2">
            <div>
              <p><strong>Medicamentos:</strong> ${formatearLista(caso.medicamentos)}</p>
            </div>
            <div>
              <p><strong>Terapias:</strong> ${formatearLista(caso.terapias)}</p>
            </div>
          </div>
          <p><strong>Necesidades y Desafíos:</strong> ${formatearLista(caso.desafios)}</p>
        </div>
      </div>
    `).join('');

    container.innerHTML = casosHTML;

    // Toggle con animación + flecha giratoria
    container.querySelectorAll('.panel-header').forEach(header => {
      header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        const arrow = header.querySelector('.arrow');
        const isOpen = body.classList.contains('open');

        if (isOpen) {
          body.classList.remove('open');
          arrow.classList.remove('open');
        } else {
          // Cerrar otros paneles abiertos
          container.querySelectorAll('.panel-body').forEach(b => {
            b.classList.remove('open');
            b.previousElementSibling.querySelector('.arrow').classList.remove('open');
          });
          
          body.classList.add('open');
          arrow.classList.add('open');
        }
      });
    });

    // Animación de aparición de tarjetas
    if (window.anime) {
      anime({
        targets: container.querySelectorAll('.caso-panel'),
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(80),
        duration: 700,
        easing: 'easeOutQuad'
      });
    }
  }

  function filtrarYRenderizar() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let filtrados = data;

    // Búsqueda
    if (searchTerm) {
      filtrados = filtrados.filter(c =>
        (c.nombre || '').toLowerCase().includes(searchTerm) ||
        (c.localizacion || '').toLowerCase().includes(searchTerm) ||
        (c.sintomas || '').toLowerCase().includes(searchTerm) ||
        (c.gravedad || '').toLowerCase().includes(searchTerm) ||
        (c.medicamentos || '').toLowerCase().includes(searchTerm) ||
        (c.terapias || '').toLowerCase().includes(searchTerm)
      );
    }

    // Filtros
    if (filtroGenero && filtroGenero.value) {
      const generoFiltro = filtroGenero.value.toLowerCase();
      filtrados = filtrados.filter(c => {
        const generoCaso = (c.genero || '').toLowerCase();
        return generoFiltro === 'm' ? generoCaso.startsWith('m') : 
               generoFiltro === 'f' ? generoCaso.startsWith('f') : true;
      });
    }
    
    if (filtroGravedad && filtroGravedad.value) {
      const gravedadFiltro = filtroGravedad.value.toLowerCase();
      filtrados = filtrados.filter(c => (c.gravedad || '').toLowerCase().includes(gravedadFiltro));
    }

    // División validados / no validados
    const validados = filtrados.filter(c => c.__origen === 'validado');
    const noValidados = filtrados.filter(c => c.__origen === 'no_validado');

    renderCasos(validados, contValidados);
    renderCasos(noValidados, contNoValidados);
    actualizarEstadisticas(validados, noValidados);
    actualizarFiltrosActivos();
  }

  // Limpiar filtros
  function limpiarFiltros() {
    searchInput.value = '';
    filtroGenero.value = '';
    filtroGravedad.value = '';
    filtrarYRenderizar();
  }

  // Eventos
  searchInput.addEventListener('input', filtrarYRenderizar);
  filtroGenero.addEventListener('change', filtrarYRenderizar);
  filtroGravedad.addEventListener('change', filtrarYRenderizar);
  btnLimpiar.addEventListener('click', limpiarFiltros);

  // Render inicial
  filtrarYRenderizar();
}

document.addEventListener('DOMContentLoaded', initCasos);

