# Générateur de mosaïque
  ***Mots-clés** : forme, couleur, densité*<br>
  [Référence]([www.p5js.org/sketches/2225777/])
## L'idée

À partir d'une phrase ou de mots rentrés au préalable par l'utilisateur, celui-ci à la possibilité à travers plusieurs réglages de modifier/déformer les caractères typographiques. Et générer ou utiliser une image d'arrière-plan.

## Description de l'outil

À partir d'une phrase ou de mots rentrés au préalable par l'utilisateur, celui-ci à la possibilité à travers plusieurs réglages de modifier/déformer les caractères typographiques. Et générer ou utiliser une image d'arrière-plan.


## Les snippets
#### 1. Modification des caractères  :
- Modifier la taille de la police
- Modifier la hauteur de ligne
- Modifier l'espacement des caractères
- **Modifier l'alignement (aligner à gauche, centrer, etc.)**
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


  
