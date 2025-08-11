import { getPatients } from '../../firebase-config.js';

class PatientList extends HTMLElement {
  async connectedCallback() {
    const patients = await getPatients();
    this.render(patients);
  }

  render(patients) {
    this.innerHTML = `
      <div class="patient-grid">
        ${patients.map(p => `
          <patient-card 
            name="${p.nombre}" 
            age="${p.edad}" 
            symptoms="${p.sintomas}"
          ></patient-card>
        `).join('')}
      </div>
    `;
  }
}

customElements.define('patient-list', PatientList);
