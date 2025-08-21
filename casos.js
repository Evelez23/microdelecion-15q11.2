// casos.js - Versión completa mejorada
async function initCasos() {
  const data = await loadDataset();

  const contValidados = document.getElementById('casos-validados');
  const contNoValidados = document.getElementById('casos-no-validados');
  const searchInput = document.getElementById('search');
  const filtroGenero = document.getElementById('filtro-genero');
  const filtroGravedad = document.getElementById('filtro-gravedad');

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
      <div class="panel">
        <div class="panel-header toggle" data-id="${i}">
          <div class="panel-title">
            <h3>${iconoGeneroEdad(caso.genero, caso.edad)} ${caso.nombre || 'Nombre no disponible'}</h3>
            <span class="${gravBadge(caso.gravedad)}">${caso.gravedad || 'No especificado'}</span>
          </div>
          <span class="arrow">▶</span>
        </div>
        <div class="panel-body" style="max-height:0; overflow:hidden; transition:max-height 0.4s ease;">
          <p><strong>Nivel de afectación:</strong> ${caso.gravedad || 'No especificado'}</p>
          <p><strong>Edad:</strong> ${caso.edad || 'No especificado'} años</p>
          <p><strong>Género:</strong> ${caso.genero || 'No especificado'}</p>
          <p><strong>Ubicación:</strong> ${caso.localizacion || 'No especificada'}</p>
          <p><strong>Pruebas realizadas:</strong> ${formatearLista(caso.pruebas)}</p>
          <p><strong>Síntomas:</strong> ${formatearLista(caso.sintomas)}</p>
          <p><strong>Medicamentos:</strong> ${formatearLista(caso.medicamentos)}</p>
          <p><strong>Terapias:</strong> ${formatearLista(caso.terapias)}</p>
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
        const isOpen = body.style.maxHeight && body.style.maxHeight !== "0px";

        if (isOpen) {
          body.style.maxHeight = "0";
          arrow.classList.remove("open");
        } else {
          // Cerrar otros paneles abiertos
          container.querySelectorAll('.panel-body').forEach(b => {
            b.style.maxHeight = "0";
            b.previousElementSibling.querySelector('.arrow').classList.remove("open");
          });
          
          body.style.maxHeight = body.scrollHeight + "px";
          arrow.classList.add("open");
        }
      });
    });

    // Animación de aparición de tarjetas
    if (window.anime) {
      anime({
        targets: container.querySelectorAll('.panel'),
        opacity: [0, 1],
        translateY: [10, 0],
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
        (c.gravedad || '').toLowerCase().includes(searchTerm)
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
  }

  // Eventos
  searchInput.addEventListener('input', filtrarYRenderizar);
  filtroGenero.addEventListener('change', filtrarYRenderizar);
  filtroGravedad.addEventListener('change', filtrarYRenderizar);

  // Render inicial
  filtrarYRenderizar();
}

document.addEventListener('DOMContentLoaded', initCasos);
