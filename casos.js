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
      return "&lt;ul&gt;" + items.map(i => `&lt;li&gt;${i}&lt;/li&gt;`).join("") + "&lt;/ul&gt;";
    }
    return texto;
  }

  function renderCasos(casos, container) {
    container.innerHTML = '';

    if (casos.length === 0) {
      container.innerHTML = `
        &lt;div class="panel" style="grid-column:1/-1"&gt;
          &lt;p&gt;No se encontraron casos que coincidan con la búsqueda&lt;/p&gt;
        &lt;/div&gt;
      `;
      return;
    }

    const casosHTML = casos.map((caso, i) => `
      &lt;div class="panel"&gt;
        &lt;div class="panel-header toggle" data-id="${i}"&gt;
          &lt;div class="panel-title"&gt;
            &lt;h3&gt;${iconoGeneroEdad(caso.genero, caso.edad)} ${caso.nombre || 'Nombre no disponible'}&lt;/h3&gt;
            &lt;span class="${gravBadge(caso.gravedad)}"&gt;${caso.gravedad || 'No especificado'}&lt;/span&gt;
          &lt;/div&gt;
          &lt;span class="arrow"&gt;▶&lt;/span&gt;
        &lt;/div&gt;
        &lt;div class="panel-body" style="max-height:0; overflow:hidden; transition:max-height 0.4s ease;"&gt;
          &lt;p&gt;&lt;strong&gt;Nivel de afectación:&lt;/strong&gt; ${caso.gravedad || 'No especificado'}&lt;/p&gt;
          &lt;p&gt;&lt;strong&gt;Edad:&lt;/strong&gt; ${caso.edad || 'No especificado'} años&lt;/p&gt;
          &lt;p&gt;&lt;strong&gt;Género:&lt;/strong&gt; ${caso.genero || 'No especificado'}&lt;/p&gt;
          &lt;p&gt;&lt;strong&gt;Ubicación:&lt;/strong&gt; ${caso.localizacion || 'No especificada'}&lt;/p&gt;
          &lt;p&gt;&lt;strong&gt;Pruebas realizadas:&lt;/strong&gt; ${formatearLista(caso.pruebas)}&lt;/p&gt;
          &lt;p&gt;&lt;strong&gt;Síntomas:&lt;/strong&gt; ${formatearLista(caso.sintomas)}&lt;/p&gt;
          &lt;p&gt;&lt;strong&gt;Medicamentos:&lt;/strong&gt; ${formatearLista(caso.medicamentos)}&lt;/p&gt;
          &lt;p&gt;&lt;strong&gt;Terapias:&lt;/strong&gt; ${formatearLista(caso.terapias)}&lt;/p&gt;
          &lt;p&gt;&lt;strong&gt;Necesidades y Desafíos:&lt;/strong&gt; ${formatearLista(caso.desafios)}&lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;
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
            
