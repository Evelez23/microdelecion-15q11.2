// js/components/patient-filter.js
class PatientFilter extends HTMLElement {
  constructor() {
    super();
    this.patients = [];
    this.filters = {
      age: null,
      gender: null,
      symptoms: []
    };
  }

  async connectedCallback() {
    await this.loadData();
    this.render();
    this.setupEventListeners();
  }

  async loadData() {
    const response = await fetch('/data/patients.json');
    this.patients = await response.json();
  }

  render() {
    this.innerHTML = `
      <div class="filter-controls">
        <range-slider min="0" max="100" value="30" label="Edad"></range-slider>
        <chip-select options="TEA,TDAH,Epilepsia"></chip-select>
      </div>
      <div class="patient-results"></div>
    `;
  }

  applyFilters() {
    return this.patients.filter(patient => {
      return (
        (!this.filters.age || patient.age <= this.filters.age) &&
        (!this.filters.gender || patient.gender === this.filters.gender) &&
        (this.filters.symptoms.length === 0 || 
         this.filters.symptoms.every(s => patient.symptoms.includes(s)))
      );
    });
  }
}
