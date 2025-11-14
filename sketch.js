// Define strokeHue as a global variable. This variable
// will be used to color each line.
let strokeHue = 20;
let colorOffset = 0; // Nouvelle variable pour décaler les couleurs
// Ajout des variables pour contrôler les points de la courbe
let controlX1, controlY1, controlX2, controlY2;

function setup() {
  createCanvas(720, 400);
  noFill();
  strokeWeight(2);
  colorMode(HSB);
  
  // Initialisation des points de contrôle
  resetControlPoints();
}

function draw() {
  describe(
    'Ten rainbow-colored lines in a bezier curve formation that change when clicked.'
  );

  background(5);

  for (let i = 0; i < 200; i += 20) {
    // Modification de la couleur avec offset
    strokeColor = (i + colorOffset) % 360; // Modulo 360 pour rester dans la gamme HSB
    stroke(strokeColor, 50, 60);

    bezier(
      mouseX - i / 2, 0 + i,
      controlX1, controlY1,  // Premier point de contrôle
      controlX2, controlY2,  // Deuxième point de contrôle
      240 - i / 16, 300 + i / 8
    );
  }
}

// Fonction appelée au clic qui modifie aléatoirement les points de contrôle
function mousePressed() {
  controlX1 = random(width);
  controlY1 = random(height);
  controlX2 = random(width);
  controlY2 = random(height);
  
  // Ajoute un décalage aléatoire aux couleurs
  colorOffset = random(360);
}

// Fonction pour réinitialiser les points de contrôle
function resetControlPoints() {
  controlX1 = 410;
  controlY1 = 20;
  controlX2 = 440;
  controlY2 = 300;
}

