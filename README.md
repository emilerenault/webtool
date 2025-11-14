# Générateur de mosaïque - Webtool
  ***Mots-clés** : forme, couleur, densité*<br>
  
  Références :
  - [Padrão Geométrico Guilherme Vieira](https://p5js.org/sketches/2225777/)
  - [Colorful Dots Yutorehito_](https://p5js.org/sketches/2225254/)
  - [The Poetry of Clouds StungEye](https://p5js.org/sketches/2225715/)
  - [Circle Square Triangle](https://nicolastilly.github.io/Circle-Square-Triangle/)

Un outil web simple et intuitif permettant de générer une mosaïque à partir de formes prédéfinies, directement manipulables sur le canevas.  
Le projet met l’accent sur l’interaction directe et la création graphique accessible, sans interface complexe.

## 🎨 Concept

Ce webtool permet de créer une mosaïque visuelle en utilisant un ensemble de formes prédéfinies (**carrés, cercles, triangles, etc.**).  
Une fois le visuel final obtenu, l’utilisateur peut le télécharger en différents formats : **.png**, **.svg**, ou **.jpg**.

## ✨ Intention

L’objectif du projet est de proposer une expérience de création graphique à la fois **simple, ludique et accessible**.  
Toutes les manipulations se font directement **sur le canevas**, sans panneau d’outils latéral, afin de privilégier une interaction naturelle et intuitive.

## ⚙️ Fonctionnement

L’outil repose uniquement sur des interactions directes :

- **Ajouter une forme**  

- **Déplacer une forme**  

- **Redimensionner**  
 
- **Rotation**  

- **Supprimer une forme**  

- **Ajustements automatiques**  
  → Certaines caractéristiques (**couleurs aléatoires, petites variations visuelles**) peuvent être générées automatiquement pour faciliter la création.



## 💾 Export

Une fois la mosaïque finalisée, l’utilisateur peut exporter son visuel aux formats :

- **PNG**  
- **SVG**  
- **JPG**

## Les snippets
#### Modification des caractères :

```
let slider;

function setup() {
  createCanvas(600, 200);
  textAlign(CENTER, CENTER);
  textSize(32);

  slider = createSlider(10, 100, 32); // min, max, valeur de départ
  slider.position(20, 20);
}

function draw() {
  background(240);
  let size = slider.value();
  textSize(size);
  text("Hello p5.js!", width / 2, height / 2);
}

```

![alt text](image.png)


  
