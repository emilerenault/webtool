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

## ⚙️ Fonctionnement

L’outil repose sur une interface graphique comprenant plusieurs contrôles :

- **Choix de la forme**  
  Sélection parmi un ensemble de formes prédéfinies.

- **Paramètres visuels**  
  Ajustement de la couleur, de la taille, de la densité ou de la rotation.

- **Organisation de la mosaïque**  
  Définition de la grille, du nombre d’éléments et de leur disposition.

- **Variations automatiques**  
  → Possibilité d’activer des variations automatiques (couleurs aléatoires, motifs génératifs, etc.).

- **Prévisualisation en temps réel**  
  La mosaïque se met à jour instantanément dans le canevas.


## 💾 Export

Une fois la composition finalisée, l’utilisateur peut exporter son visuel dans les formats :

- **PNG**  
- **SVG**  
- **JPG**

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
![alt text](image.png)


  
