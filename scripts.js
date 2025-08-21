<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Genética | Microdeleción 15q11.2</title>
  <meta name="description" content="Información genética sobre la microdeleción 15q11.2">
  <link rel="stylesheet" href="styles.css"/>
  <script defer src="https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script defer src="scripts.js"></script>
  <script defer src="genetica.js"></script>
</head>
<body>
  <nav class="nav" role="navigation">
    <div class="inner">
      <div class="brand">
        <img class="logo" src="https://raw.githubusercontent.com/Evelez23/-microdelecion/refs/heads/main/img/logo%20micro1.png" alt="Logo Microdeleción 15q11.2">
        <div>Microdeleción 15q11.2</div>
      </div>
      <div class="nav-links">
        <a href="index.html">Inicio</a>
        <a href="resumen.html">Resumen</a>
        <a href="casos.html">Casos</a>
        <a href="genetica.html">Genética</a>
        <a href="estadisticas.html">Estadísticas</a>
        <a class="btn-agregar" href="formulario.html">Reportar caso</a>
      </div>
    </div>
  </nav>

  <main>
    <section class="container">
      <h1>Microdeleción 15q11.2</h1>
      <p class="subtitle">
        Información clave para comprender esta condición genética poco frecuente, organizada de manera clara para familias y profesionales.
      </p>

      <!-- Hero con imagen -->
      <div class="hero-genetica">
        <img src="https://raw.githubusercontent.com/Evelez23/-microdelecion/refs/heads/main/img/7572d736-f7ab-41b2-84a4-1b5a419f2c94.jpg" 
             alt="Familias y microdeleción" class="hero-image">
      </div>

      <!-- Qué es -->
      <div class="panel">
        <h2>¿Qué es?</h2>
        <p>
          La <strong>microdeleción 15q11.2</strong> es una condición genética rara causada por la 
          <strong>pérdida de una pequeña porción del cromosoma 15</strong>, en la región conocida como 
          <em>Burnside-Butler</em>. Afecta los genes <strong>TUBGCP5, CYFIP1, NIPA2 y NIPA1</strong>.
        </p>
      </div>

      <!-- Síntomas -->
      <div class="grid-2">
        <div class="panel">
          <h2>Síntomas frecuentes</h2>
          <ul>
            <li>Retraso en el desarrollo motor y/o del lenguaje.</li>
            <li>Dificultades de aprendizaje (leves a moderadas).</li>
            <li>Trastornos de la comunicación, TEA, TDAH, ansiedad.</li>
            <li>Convulsiones o actividad epileptiforme.</li>
            <li>Hipotonía en la infancia.</li>
            <li>Problemas gastrointestinales y de sueño.</li>
          </ul>
        </div>
        <div class="panel image-panel">
          <img src="https://raw.githubusercontent.com/Evelez23/-microdelecion/refs/heads/main/img/i%CC%81cono%20DNA.png" 
               alt="Icono ADN" class="icono-dna">
        </div>
      </div>

      <!-- Frecuencia y herencia -->
      <div class="grid-2">
        <div class="panel">
          <h2>¿Qué tan común es?</h2>
          <p>
            Se estima en alrededor del <strong>0.25–0.30% de las personas evaluadas genéticamente</strong>. 
            Es una de las microdeleciones más frecuentes detectadas en microarrays clínicos.  
            <em>Expresividad variable:</em> no todos los portadores presentan síntomas graves.
          </p>
        </div>
        <div class="panel">
          <h2>¿Se hereda?</h2>
          <p>
            Puede heredarse de un progenitor (con o sin síntomas).  
            Si es <em>de novo</em> (nueva en el niño), la probabilidad de repetición es baja.
          </p>
        </div>
      </div>

      <!-- Detección -->
      <div class="panel">
        <h2>¿Cómo se detecta?</h2>
        <p>
          Mediante estudios como <strong>Microarray CGH o SNP microarrays</strong>, que son más precisos que el cariotipo convencional.  
          <br>Ejemplo de resultado: <code>arr[hg19]15q11.2(22728371-23260335)x1dn</code>.
        </p>
      </div>

      <!-- Genes involucrados -->
      <div class="grid-2">
        <div class="panel">
          <h2>Genes involucrados</h2>
          <ul>
            <li><strong>NIPA1 / NIPA2</strong>: transporte de magnesio, epilepsia y rigidez muscular.</li>
            <li><strong>CYFIP1</strong>: vinculado con autismo y dificultades cognitivas.</li>
            <li><strong>TUBGCP5</strong>: asociado a TDAH, TOC y ansiedad.</li>
          </ul>
        </div>
        <div class="panel image-panel">
          <img src="https://raw.githubusercontent.com/Evelez23/-microdelecion/refs/heads/main/img/ChatGPT%20Image%2013%20ago%202025%2C%2010_39_09.png" 
               alt="Ilustración genes" class="image-side">
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid-2">
        <div class="panel">
          <h2>Genes implicados</h2>
          <div class="gene-info">
            <p>Esta región crítica contiene cuatro genes principales:</p>
            <ul>
              <li><strong>CYFIP1</strong>: Regula la síntesis de proteínas en sinapsis neuronales</li>
              <li><strong>NIPA1/2</strong>: Transportadores de magnesio esenciales</li>
              <li><strong>TUBGCP5</strong>: Participa en la organización microtubular</li>
            </ul>
          </div>
          <canvas id="chartGenes" height="160" aria-label="Frecuencia de afectación de genes"></canvas>
        </div>
        
        <div class="panel">
          <h2>Patrón de herencia</h2>
          <div class="inheritance-info">
            <p>Características genéticas principales:</p>
            <ul>
              <li>Herencia <strong>autosómica dominante</strong> con penetrancia variable</li>
              <li>~65% de casos son <em>de novo</em> (no heredados)</li>
              <li>Riesgo de recurrencia del 50% en descendencia</li>
            </ul>
          </div>
          <canvas id="chartHerencia" height="160" aria-label="Distribución de patrones de herencia"></canvas>
        </div>
      </div>

      <!-- Apoyo -->
      <div class="panel">
        <h2>Apoyo y recomendaciones</h2>
        <p>
          La intervención temprana con <strong>terapias de lenguaje, fisioterapia y apoyo conductual</strong> 
          puede marcar la diferencia.  
          <br>Existen comunidades de familias, como <em>Unique</em>, donde compartir experiencias y apoyarse mutuamente.
        </p>
        <blockquote>
          "La microdeleción 15q11.2 no define a tu hijo. Con apoyos adecuados, cada persona puede desarrollarse a su manera y alcanzar su máximo potencial."
        </blockquote>
      </div>
    </section>
  </main>

  <footer class="footer">© 2025 | Información genética actualizada a 2025</footer>
</body>
</html>
