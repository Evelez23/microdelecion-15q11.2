class PatientCard extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name');
    const age = this.getAttribute('age');
    
    this.innerHTML = `
      <div class="patient-card">
        <h3>${name}</h3>
        <p>Edad: ${age} años</p>
        <button class="details-btn">Ver detalles</button>
      </div>
    `;
  }
}

customElements.define('patient-card', PatientCard);
