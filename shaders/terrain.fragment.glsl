  precision mediump float;
  varying vec2 vUv;
  varying float vInsideShape;
  uniform float thresholdDistance;

  void main() {
    if (vInsideShape > thresholdDistance) {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Couleur rouge pour l'intérieur
    }else {
      gl_FragColor = vec4(0, 0, 0, 0.1);
    }
  }