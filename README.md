# Générateur de mosaïque — Webtool
***Mots-clés :** forme, couleur, densité*<br>

**Références :**
- [Padrão Geométrico — Guilherme Vieira](https://p5js.org/sketches/2225777/)
- [Colorful Dots — Yutorehito_](https://p5js.org/sketches/2225254/)
- [The Poetry of Clouds — StungEye](https://p5js.org/sketches/2225715/)
- [Circle Square Triangle](https://nicolastilly.github.io/Circle-Square-Triangle/)

Un outil web simple et intuitif permettant de générer une mosaïque graphique à partir de formes prédéfinies.  
Le projet met l’accent sur une **interface claire et accessible**, permettant à l’utilisateur de personnaliser son visuel sans difficulté.

## 🎨 Concept

Ce webtool permet de créer une mosaïque visuelle en sélectionnant et configurant des formes prédéfinies (**carrés, cercles, triangles, etc.**) via une interface dédiée.  
Une fois la mosaïque finalisée, l’utilisateur peut l’exporter aux formats **.png**, **.svg** ou **.jpg**.

## ✨ Intention

L’objectif est d’offrir une expérience de création **simple, guidée et personnalisable**, adaptée aussi bien aux débutants qu’aux utilisateurs plus curieux.  
L’interface permet d’ajuster facilement différents paramètres visuels, tout en garantissant une prise en main rapide et sans surcharge.
## 👤 À propos du projet

Ce projet est un **outil étudiant en web design**, développé par **Emile Renault**.  

L'approche visuelle s'inspire du travail de [Yutorehito_](https://p5js.org/sketches/2225254/), artiste dont les explorations génératives autour des formes et des couleurs ont guidé le développement de cet outil.

**Typographie :** [Fredoka](https://fonts.google.com/specimen/Fredoka) — Google Fonts
## ⚙️ Fonctionnement

L’outil repose sur une interface graphique comprenant plusieurs contrôles :

- **Disposition**  
  Choix entre une grille régulière ou une disposition libre (aléatoire).

- **Densité**  
  Slider ajustant l'espacement entre les formes (0-100%).

- **Formes**  
  Trois formes géométriques disponibles : **Rond**, **Carré**, **Triangle**.
  - Toggles d'activation/désactivation pour chaque forme
  - Style : Remplissage ou Tracé
  - Taille : Uniforme ou Variable
  - Transparence : Slider 0-100% (0% = opaque, 100% = transparent)
  - Épaisseur du tracé (si le style Tracé est activé)

- **Couleurs**  
  Ajustement des 4 canaux CMYK (Cyan, Magenta, Yellow, Black).

- **Prévisualisation en temps réel**  
  Le canvas se met à jour instantanément lors de chaque modification.


## 💾 Export

Une fois la composition finalisée, l'utilisateur peut exporter son visuel en :

- **PNG** (1920×1080px)

## 🧩 Snippets
### circle()
*Draws a circle*
```
function setup() {
  createCanvas(100, 100);

  background(200);

  circle(50, 50, 25);

  describe('A white circle with black outline in the middle of a gray canvas.');
}
```
### ellipse()
*Draws an ellipse (oval).*

```
function setup() {
  createCanvas(100, 100, WEBGL);

  background(200);

  // Use 6 vertices.
  ellipse(0, 0, 80, 40, 6);

  describe('A white hexagon on a gray canvas.');
}
```
### rect()
*Draws a rectangle.*

```
function setup() {
  createCanvas(100, 100);

  background(200);

  rect(30, 20, 55, 55);

  describe('A white square with a black outline on a gray canvas.');
}
```

### push()
*Begins a drawing group that contains its own styles and transformations.*

```
function setup() {
  createCanvas(100, 100);

  background(200);

  // Draw the left circle.
  circle(25, 50, 20);

  // Begin the drawing group.
  push();

  // Translate the origin to the center.
  translate(50, 50);

  // Style the circle.
  strokeWeight(5);
  stroke('royalblue');
  fill('orange');

  // Draw the circle.
  circle(0, 0, 20);

  // End the drawing group.
  pop();

  // Draw the right circle.
  circle(75, 50, 20);

  describe(
    'Three circles drawn in a row on a gray background. The left and right circles are white with thin, black borders. The middle circle is orange with a thick, blue border.'
  );
}
```

### scale()
*The scale() function scales the current coordinate system by the specified factor.*

```
function setup() {
  // Create the canvas
  createCanvas(720, 400);

  // Create screen reader accessible description
  textOutput();
}

function draw() {
  // Clear the background
  background(0);

  // Draw blue square
  // Save current coordinate system
  push();

  // Scale by 2
  scale(2);

  // Set color to blue
  fill(33, 89, 194);

  // Draw square at origin, size 200
  square(0, 0, 200);

  // Restore coordinate system
  pop();

  // Draw white square
  // Set color to white
  fill(255);

  // Draw square at origin, size 200
  square(0, 0, 200);

  // Draw green square
  // Save current coordinate system
  push();

  // Scale by .5 in x and .75 in y
  scale(0.5, 0.75);

  // Set color to green
  fill(42, 150, 60);

  // Draw square at origin, size 200
  square(0, 0, 200);

  // Restore coordinate system
  pop();
}
```
### random()
*Returns a random number or a random element from an array.*

```
function setup() {
  createCanvas(100, 100);

  background(200);

  // Get random coordinates between 0 and 100.
  let x = random(0, 100);
  let y = random(0, 100);

  // Draw a point.
  strokeWeight(5);
  point(x, y);

  describe('A black dot appears in a random position on a gray square.');
}
```
### rotate()
*Rotates the coordinate system.*

```
function setup() {
  createCanvas(100, 100);

  describe(
    "A white rectangle on a gray background. The rectangle's long axis runs from top-left to bottom-right."
  );
}

function draw() {
  background(200);

  // Rotate the coordinate system 1/8 turn.
  rotate(QUARTER_PI);

  // Draw a rectangle at coordinates (50, 0).
  rect(50, 0, 40, 20);
}
```
![alt text](image.png)


  
