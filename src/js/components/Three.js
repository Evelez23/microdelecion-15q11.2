// js/components/dna-viewer.js
class DNAViewer extends HTMLElement {
  connectedCallback() {
    this.initScene();
    this.renderHelix();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.offsetWidth / this.offsetHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.offsetWidth, this.offsetHeight);
    this.appendChild(this.renderer.domElement);
  }

  renderHelix() {
    const geometry = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(this.generateDNAPath()),
      1000, 0.2, 8, false
    );
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x3a86ff,
      emissive: 0x1a1a3a,
      shininess: 100 
    });
    this.dna = new THREE.Mesh(geometry, material);
    this.scene.add(this.dna);
    this.animate();
  }

  generateDNAPath() {
    // Lógica para generar espiral de ADN
    return [...Array(100)].map((_, i) => {
      const angle = i * 0.2;
      return new THREE.Vector3(
        Math.sin(angle) * 2,
        i * 0.1,
        Math.cos(angle) * 2
      );
    });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.dna.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }
}

customElements.define('dna-viewer', DNAViewer);
