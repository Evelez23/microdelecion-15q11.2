// form.js - CÓDIGO COMPLETO CORREGIDO
console.log('✅ form.js cargado correctamente');

// Configuración de Supabase CORREGIDA
const SUPABASE_URL = 'https://bfzyrfsfptkyrnyogxuy.supabase.co/rest/v1';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmenlyZnNmcHRreXJueW9neHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNDI1MzIsImV4cCI6MjA3MTkxODUzMn0.VGe5dJRt6oJfUPKS8mvuy539CKyv7kTt6u8lRmBQi5A';

// Mostrar mensaje de estado
function showMessage(message, type) {
  const statusDiv = document.getElementById('form-status');
  if (!statusDiv) {
    console.error('No se encontró el elemento form-status');
    return;
  }
  
  statusDiv.textContent = message;
  statusDiv.className = `form-status ${type}`;
  statusDiv.style.display = 'block';
  
  statusDiv.scrollIntoView({ behavior: 'smooth' });
}

// Validar formulario
function validateForm(formData) {
  const errors = [];
  
  if (!formData.nombre?.trim()) errors.push('Nombre es requerido');
  if (!formData.edad || formData.edad < 0) errors.push('Edad válida es requerida');
  if (!formData.genero) errors.push('Género es requerido');
  if (!formData.sintomas?.trim()) errors.push('Síntomas son requeridos');
  if (!formData.gravedad) errors.push('Nivel de afectación es requerido');
  
  return errors;
}

// Enviar datos a Supabase CORREGIDO
async function submitToSupabase(formData) {
  try {
    console.log('Enviando datos a Supabase:', formData);
    
    const response = await fetch(`${SUPABASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(formData)
    });
    
    console.log('Respuesta de Supabase:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error respuesta Supabase:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error en submitToSupabase:', error);
    throw error;
  }
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
  e.preventDefault();
  console.log('Formulario enviado');
  
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  
  // Validar checkbox de privacidad
  const privacyCheckbox = document.getElementById('privacidad');
  if (!privacyCheckbox?.checked) {
    showMessage('Debes aceptar la política de privacidad para enviar el formulario', 'error');
    return;
  }
  
  // Obtener datos del formulario
  const formData = {
    nombre: document.getElementById('nombre')?.value.trim() || '',
    edad: parseInt(document.getElementById('edad')?.value) || 0,
    genero: document.getElementById('genero')?.value || '',
    localizacion: document.getElementById('localizacion')?.value.trim() || '',
    sintomas: document.getElementById('sintomas')?.value.trim() || '',
    gravedad: document.getElementById('gravedad')?.value || '',
    pruebas: document.getElementById('pruebas')?.value.trim() || '',
    medicamentos: document.getElementById('medicamentos')?.value.trim() || '',
    terapias: document.getElementById('terapias')?.value.trim() || '',
    desafios: document.getElementById('desafios')?.value.trim() || '',
    comentarios: document.getElementById('comentarios')?.value.trim() || '',
    created_at: new Date().toISOString()
  };
  
  console.log('Datos del formulario:', formData);
  
  // Validar datos
  const errors = validateForm(formData);
  if (errors.length > 0) {
    showMessage('❌ ' + errors.join(', '), 'error');
    return;
  }
  
  // Deshabilitar botón y mostrar carga
  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...';
  
  try {
    // Enviar a Supabase
    const result = await submitToSupabase(formData);
    
    if (result.success) {
      // Éxito
      showMessage('✅ ¡Reporte enviado con éxito! Gracias por contribuir a nuestra comunidad. Redirigiendo...', 'success');
      
      // Limpiar formulario
      form.reset();
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        window.location.href = 'comentarios.html';
      }, 2000);
    }
    
  } catch (error) {
    console.error('Error en handleFormSubmit:', error);
    showMessage('❌ Error al enviar el reporte: ' + error.message, 'error');
  } finally {
    // Restaurar botón
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
}

// Validación en tiempo real
function setupRealTimeValidation() {
  const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
  
  requiredFields.forEach(field => {
    field.addEventListener('blur', function() {
      if (!this.value.trim()) {
        this.style.borderColor = '#ff6b6b';
      } else {
        this.style.borderColor = '';
      }
    });
  });
}

// Inicializar formulario
function initForm() {
  const form = document.getElementById('casoForm');
  if (!form) {
    console.error('No se encontró el formulario con id casoForm');
    return;
  }
  
  form.addEventListener('submit', handleFormSubmit);
  setupRealTimeValidation();
  
  console.log('✅ Formulario inicializado correctamente');
}

// Cargar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initForm);
} else {
  initForm();
}

// Manejar errores globales
window.addEventListener('error', (e) => {
  console.error('Error global:', e.error);
  showMessage('❌ Error inesperado. Por favor, recarga la página.', 'error');
});

// Exportar funciones para debugging (opcional)
window.formDebug = {
  showMessage,
  validateForm,
  submitToSupabase
};
