// ============================================================================
// GÉNÉRATEUR DE MOSAÏQUE — Configuration et Variables Globales
// ============================================================================

// ============================================================================
// SECTION 1 : VARIABLES DE COULEUR ET D'IMAGE
// ============================================================================
let preimage;
let cyan, magenta, yellow, black;
let cg;
let seedMotif = 42; // NOUVEAU : seed pour générer toujours le même motif

// ============================================================================
// SECTION 2 : VARIABLES DE PARAMÈTRES UTILISATEUR
// ============================================================================
let selecteurDisposition;
let curseurDensite, curseurOpacite, curseurEpaisseur;
let caseCercles, caseCarres, caseTriangles;
let curseurEchelleCercles, curseurEchelleCarres, curseurEchelleTriangles;
let conteneurCurseurCercles, conteneurCurseurCarres, conteneurCurseurTriangles;
let chevronCercles, chevronCarres, chevronTriangles;
let valeurOpacite, valeurEpaisseur;
let paletteInputs = [];
let palettePreviews = [];
let palettePickers = [];
let largeurPanneau = 280;
let densite = 20;
let typeDisposition = 'grille';
let echelleCercles = 1;
let echelleCarres = 1;
let echelleTriangles = 1;
let unifierCercles = false;
let unifierCarres = false;
let unifierTriangles = false;
let opaciteForme = 1;
let necesiteRedessiner = true;
let melangerFormes = true;
let afficherCercles = true;
let afficherCarres = true;
let afficherTriangles = true;
let formesCreuses = false;
let epaisseurContour = 2;

// ============================================================================
// FONCTION : preload()
// ============================================================================
function preload() {
  // Optionnel : charger une image personnalisée
}

// ============================================================================
// FONCTION : setup()
// ============================================================================
function setup() {
  createCanvas(windowWidth - largeurPanneau, windowHeight);
  angleMode(DEGREES);
  genererNouveauMotif();

  // ===== CRÉATION DU PANNEAU DE RÉGLAGES =====
  let panneauControle = createDiv();
  panneauControle.id('panneauControle');

  // ===== TITRE DU PANNEAU =====
  let titre = createP('Réglages');
  titre.parent(panneauControle);
  titre.class('titre');

  // ===== CONTRÔLE 1 : DISPOSITION =====
  let etiquetteDisposition = createP('Disposition');
  etiquetteDisposition.parent(panneauControle);
  etiquetteDisposition.class('label');

  selecteurDisposition = createSelect();
  selecteurDisposition.parent(panneauControle);
  selecteurDisposition.option('Grille', 'grille');
  selecteurDisposition.option('Aléatoire', 'aleatoire');
  selecteurDisposition.changed(() => {
    typeDisposition = selecteurDisposition.value();
    necesiteRedessiner = true;
  });

  // ===== CONTRÔLE 2 : FORMES AVEC TAILLE INDIVIDUELLE =====
  let etiquetteFormes = createP('Formes et tailles');
  etiquetteFormes.parent(panneauControle);
  etiquetteFormes.class('label');

  // --- CERCLES ---
  let conteneurCercles = createDiv();
  conteneurCercles.parent(panneauControle);
  conteneurCercles.class('forme-controle');

  let headerCercles = createDiv();
  headerCercles.parent(conteneurCercles);
  headerCercles.class('forme-controle-header');

  caseCercles = createCheckbox(' Cercles', true);
  caseCercles.parent(headerCercles);
  caseCercles.changed(() => {
    afficherCercles = caseCercles.checked();
    melangerFormes = afficherCercles || afficherCarres || afficherTriangles;
    necesiteRedessiner = true;
  });

  caseCercles.elt.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  chevronCercles = createSpan('▶');
  chevronCercles.parent(headerCercles);
  chevronCercles.class('chevron');

  headerCercles.mousePressed(() => {
    toggleCurseur(conteneurCurseurCercles, chevronCercles);
  });

  conteneurCurseurCercles = createDiv();
  conteneurCurseurCercles.parent(conteneurCercles);
  conteneurCurseurCercles.class('curseur-container');

  curseurEchelleCercles = createSlider(0.5, 3, 1, 0.1);
  curseurEchelleCercles.parent(conteneurCurseurCercles);
  curseurEchelleCercles.input(() => {
    echelleCercles = curseurEchelleCercles.value();
    valeurEchelleCercles.html('Taille : ' + echelleCercles.toFixed(1));
    necesiteRedessiner = true;
  });

  let valeurEchelleCercles = createP('Taille : ' + echelleCercles.toFixed(1));
  valeurEchelleCercles.parent(conteneurCurseurCercles);
  valeurEchelleCercles.class('mini-valeur');

  // Toggle pour unifier les cercles
  let toggleContainerCercles = createDiv();
  toggleContainerCercles.parent(conteneurCurseurCercles);
  toggleContainerCercles.class('toggle-container');

  let toggleLabelCercles = createSpan('Taille uniforme');
  toggleLabelCercles.parent(toggleContainerCercles);
  toggleLabelCercles.class('toggle-label');

  let toggleSwitchCercles = createDiv();
  toggleSwitchCercles.parent(toggleContainerCercles);
  toggleSwitchCercles.class('toggle-switch');

  let checkboxCercles = createInput();
  checkboxCercles.attribute('type', 'checkbox');
  checkboxCercles.parent(toggleSwitchCercles);
  if (unifierCercles) checkboxCercles.elt.checked = true;
  checkboxCercles.changed(() => {
    unifierCercles = checkboxCercles.elt.checked;
    necesiteRedessiner = true;
  });

  let sliderCercles = createSpan('');
  sliderCercles.parent(toggleSwitchCercles);
  sliderCercles.class('toggle-slider');

  // --- CARRÉS ---
  let conteneurCarres = createDiv();
  conteneurCarres.parent(panneauControle);
  conteneurCarres.class('forme-controle');

  let headerCarres = createDiv();
  headerCarres.parent(conteneurCarres);
  headerCarres.class('forme-controle-header');

  caseCarres = createCheckbox(' Carrés', true);
  caseCarres.parent(headerCarres);
  caseCarres.changed(() => {
    afficherCarres = caseCarres.checked();
    melangerFormes = afficherCercles || afficherCarres || afficherTriangles;
    necesiteRedessiner = true;
  });

  caseCarres.elt.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  chevronCarres = createSpan('▶');
  chevronCarres.parent(headerCarres);
  chevronCarres.class('chevron');

  headerCarres.mousePressed(() => {
    toggleCurseur(conteneurCurseurCarres, chevronCarres);
  });

  conteneurCurseurCarres = createDiv();
  conteneurCurseurCarres.parent(conteneurCarres);
  conteneurCurseurCarres.class('curseur-container');

  curseurEchelleCarres = createSlider(0.5, 3, 1, 0.1);
  curseurEchelleCarres.parent(conteneurCurseurCarres);
  curseurEchelleCarres.input(() => {
    echelleCarres = curseurEchelleCarres.value();
    valeurEchelleCarres.html('Taille : ' + echelleCarres.toFixed(1));
    necesiteRedessiner = true;
  });

  let valeurEchelleCarres = createP('Taille : ' + echelleCarres.toFixed(1));
  valeurEchelleCarres.parent(conteneurCurseurCarres);
  valeurEchelleCarres.class('mini-valeur');

  let toggleContainerCarres = createDiv();
  toggleContainerCarres.parent(conteneurCurseurCarres);
  toggleContainerCarres.class('toggle-container');

  let toggleLabelCarres = createSpan('Taille uniforme');
  toggleLabelCarres.parent(toggleContainerCarres);
  toggleLabelCarres.class('toggle-label');

  let toggleSwitchCarres = createDiv();
  toggleSwitchCarres.parent(toggleContainerCarres);
  toggleSwitchCarres.class('toggle-switch');

  let checkboxCarres = createInput();
  checkboxCarres.attribute('type', 'checkbox');
  checkboxCarres.parent(toggleSwitchCarres);
  if (unifierCarres) checkboxCarres.elt.checked = true;
  checkboxCarres.changed(() => {
    unifierCarres = checkboxCarres.elt.checked;
    necesiteRedessiner = true;
  });

  let sliderCarres = createSpan('');
  sliderCarres.parent(toggleSwitchCarres);
  sliderCarres.class('toggle-slider');

  // --- TRIANGLES ---
  let conteneurTriangles = createDiv();
  conteneurTriangles.parent(panneauControle);
  conteneurTriangles.class('forme-controle');

  let headerTriangles = createDiv();
  headerTriangles.parent(conteneurTriangles);
  headerTriangles.class('forme-controle-header');

  caseTriangles = createCheckbox(' Triangles', true);
  caseTriangles.parent(headerTriangles);
  caseTriangles.changed(() => {
    afficherTriangles = caseTriangles.checked();
    melangerFormes = afficherCercles || afficherCarres || afficherTriangles;
    necesiteRedessiner = true;
  });

  caseTriangles.elt.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  chevronTriangles = createSpan('▶');
  chevronTriangles.parent(headerTriangles);
  chevronTriangles.class('chevron');

  headerTriangles.mousePressed(() => {
    toggleCurseur(conteneurCurseurTriangles, chevronTriangles);
  });

  conteneurCurseurTriangles = createDiv();
  conteneurCurseurTriangles.parent(conteneurTriangles);
  conteneurCurseurTriangles.class('curseur-container');

  curseurEchelleTriangles = createSlider(0.5, 3, 1, 0.1);
  curseurEchelleTriangles.parent(conteneurCurseurTriangles);
  curseurEchelleTriangles.input(() => {
    echelleTriangles = curseurEchelleTriangles.value();
    valeurEchelleTriangles.html('Taille : ' + echelleTriangles.toFixed(1));
    necesiteRedessiner = true;
  });

  let valeurEchelleTriangles = createP('Taille : ' + echelleTriangles.toFixed(1));
  valeurEchelleTriangles.parent(conteneurCurseurTriangles);
  valeurEchelleTriangles.class('mini-valeur');

  let toggleContainerTriangles = createDiv();
  toggleContainerTriangles.parent(conteneurCurseurTriangles);
  toggleContainerTriangles.class('toggle-container');

  let toggleLabelTriangles = createSpan('Taille uniforme');
  toggleLabelTriangles.parent(toggleContainerTriangles);
  toggleLabelTriangles.class('toggle-label');

  let toggleSwitchTriangles = createDiv();
  toggleSwitchTriangles.parent(toggleContainerTriangles);
  toggleSwitchTriangles.class('toggle-switch');

  let checkboxTriangles = createInput();
  checkboxTriangles.attribute('type', 'checkbox');
  checkboxTriangles.parent(toggleSwitchTriangles);
  if (unifierTriangles) checkboxTriangles.elt.checked = true;
  checkboxTriangles.changed(() => {
    unifierTriangles = checkboxTriangles.elt.checked;
    necesiteRedessiner = true;
  });

  let sliderTriangles = createSpan('');
  sliderTriangles.parent(toggleSwitchTriangles);
  sliderTriangles.class('toggle-slider');

  // ===== CONTRÔLE 3 : DENSITÉ =====
  let etiquetteDensite = createP('Densité');
  etiquetteDensite.parent(panneauControle);
  etiquetteDensite.class('label');

  curseurDensite = createSlider(5, 50, 20, 1);
  curseurDensite.parent(panneauControle);
  curseurDensite.input(() => {
    densite = curseurDensite.value();
    valeurDensite.html(densite);
    necesiteRedessiner = true;
  });

  let valeurDensite = createP(densite);
  valeurDensite.parent(panneauControle);
  valeurDensite.class('valeur');

  // ===== CONTRÔLE 4 : OPACITÉ =====
  let etiquetteOpacite = createP('Opacité');
  etiquetteOpacite.parent(panneauControle);
  etiquetteOpacite.class('label');

  curseurOpacite = createSlider(0, 1, 1, 0.01);
  curseurOpacite.parent(panneauControle);
  curseurOpacite.input(() => {
    opaciteForme = curseurOpacite.value();
    valeurOpacite.html(opaciteForme.toFixed(2));
    necesiteRedessiner = true;
  });

  valeurOpacite = createP(opaciteForme.toFixed(2));
  valeurOpacite.parent(panneauControle);
  valeurOpacite.class('valeur');

  // ===== CONTRÔLE 5 : FORMES CREUSES =====
  let caseFormesCreuses = createCheckbox(' Formes creuses (contour uniquement)', formesCreuses);
  caseFormesCreuses.parent(panneauControle);
  caseFormesCreuses.changed(() => {
    formesCreuses = caseFormesCreuses.checked();
    necesiteRedessiner = true;
  });

  // ===== CONTRÔLE 6 : ÉPAISSEUR DU CONTOUR =====
  let etiquetteEpaisseur = createP('Épaisseur du contour (px)');
  etiquetteEpaisseur.parent(panneauControle);
  etiquetteEpaisseur.class('label');

  curseurEpaisseur = createSlider(0, 20, epaisseurContour, 0.5);
  curseurEpaisseur.parent(panneauControle);
  curseurEpaisseur.input(() => {
    epaisseurContour = curseurEpaisseur.value();
    valeurEpaisseur.html(epaisseurContour.toFixed(1) + ' px');
    necesiteRedessiner = true;
  });

  valeurEpaisseur = createP(epaisseurContour.toFixed(1) + ' px');
  valeurEpaisseur.parent(panneauControle);
  valeurEpaisseur.class('valeur');

  // ===== CONTRÔLE 7 : PALETTE DE COULEURS =====
  let etiquettePalette = createP('Palette de couleurs (HEX)');
  etiquettePalette.parent(panneauControle);
  etiquettePalette.class('label');

  if (!cyan) cyan = color('#00aacc');
  if (!magenta) magenta = color('#cc0099');
  if (!yellow) yellow = color('#ffd400');
  if (!black) black = color('#222222');

  const couleursInit = [cyan, magenta, yellow, black];

  for (let i = 0; i < 4; i++) {
    let row = createDiv();
    row.parent(panneauControle);
    row.class('palette-row');

    let prev = createDiv();
    prev.parent(row);
    prev.class('color-preview');
    prev.mousePressed(() => {
      palettePickers[i].elt.click();
    });
    palettePreviews.push(prev);

    let hexVal = rgbToHex(couleursInit[i]);
    let inp = createInput(hexVal);
    inp.parent(row);
    inp.attribute('type', 'text');
    inp.attribute('maxlength', '7');
    inp.input(() => {
      let v = normalizeHex(inp.value());
      if (v) {
        setPaletteColor(i, v);
        updatePreview(i);
        necesiteRedessiner = true;
      }
    });
    paletteInputs.push(inp);

    let picker = createInput(hexVal, 'color');
    picker.parent(row);
    picker.input(() => {
      let v = picker.value();
      paletteInputs[i].value(v);
      setPaletteColor(i, v);
      updatePreview(i);
      necesiteRedessiner = true;
    });
    palettePickers.push(picker);
  }

  updateAllPreviews();

  // ===== BOUTON : GÉNÉRATION ALÉATOIRE =====
  let boutonGeneration = createButton('Générer aléatoirement');
  boutonGeneration.parent(panneauControle);
  boutonGeneration.class('btn-generer');
  boutonGeneration.mousePressed(() => {
    genererNouveauMotifAleatoire();
  });

  // ===== BOUTON : TÉLÉCHARGEMENT PNG =====
  let boutonTelecharger = createButton('Télécharger (PNG 1920×1080)');
  boutonTelecharger.parent(panneauControle);
  boutonTelecharger.class('btn-telecharger');
  boutonTelecharger.mousePressed(() => {
    telechargerPNG();
  });
}

// ============================================================================
// FONCTION : toggleCurseur()
// Description : Affiche/masque le curseur et anime le chevron
// ============================================================================
function toggleCurseur(conteneur, chevron) {
  if (conteneur.hasClass('ouvert')) {
    conteneur.removeClass('ouvert');
    chevron.removeClass('ouvert');
  } else {
    conteneur.addClass('ouvert');
    chevron.addClass('ouvert');
  }
}

// ============================================================================
// FONCTION : draw()
// ============================================================================
function draw() {
  if (necesiteRedessiner) {
    dessinerCMYK();
    necesiteRedessiner = false;
  }
}

// ============================================================================
// FONCTION : genererNouveauMotifAleatoire() - COMPLÈTE ET CORRIGÉE
// ============================================================================
function genererNouveauMotifAleatoire() {
  // Randomiser les couleurs
  cyan = color(random(255), random(255), random(255));
  magenta = color(random(255), random(255), random(255));
  yellow = color(random(255), random(255), random(255));
  black = color(random(255), random(255), random(255));

  // Générer un nouveau seed pour la composition
  seedMotif = floor(random(100000));

  // Randomiser la disposition
  let dispositionsAleatoires = ['grille', 'aleatoire'];
  typeDisposition = random(dispositionsAleatoires);
  if (selecteurDisposition) selecteurDisposition.value(typeDisposition);
  
  // Randomiser la densité
  densite = floor(random(5, 51));
  if (curseurDensite) curseurDensite.value(densite);
  
  // Randomiser les échelles individuelles
  echelleCercles = round(random(0.5, 3) * 10) / 10;
  if (curseurEchelleCercles) curseurEchelleCercles.value(echelleCercles);
  
  echelleCarres = round(random(0.5, 3) * 10) / 10;
  if (curseurEchelleCarres) curseurEchelleCarres.value(echelleCarres);
  
  echelleTriangles = round(random(0.5, 3) * 10) / 10;
  if (curseurEchelleTriangles) curseurEchelleTriangles.value(echelleTriangles);
  
  // Randomiser l'opacité
  opaciteForme = round(random(0.3, 1) * 100) / 100;
  if (curseurOpacite) curseurOpacite.value(opaciteForme);
  if (valeurOpacite) valeurOpacite.html(opaciteForme.toFixed(2));
  
  // Randomiser les formes affichées
  afficherCercles = random() > 0.3;
  afficherCarres = random() > 0.3;
  afficherTriangles = random() > 0.3;
  
  if (!afficherCercles && !afficherCarres && !afficherTriangles) {
    afficherCercles = true;
  }
  
  if (caseCercles) caseCercles.checked(afficherCercles);
  if (caseCarres) caseCarres.checked(afficherCarres);
  if (caseTriangles) caseTriangles.checked(afficherTriangles);
  
  // Randomiser les états d'unification
  unifierCercles = random() > 0.7;
  unifierCarres = random() > 0.7;
  unifierTriangles = random() > 0.7;

  // Mettre à jour les toggle switches
  let allCheckboxes = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
  if (allCheckboxes.length >= 3) {
    allCheckboxes[0].checked = unifierCercles;
    allCheckboxes[1].checked = unifierCarres;
    allCheckboxes[2].checked = unifierTriangles;
  }
  
  // Randomiser les formes creuses et l'épaisseur du contour
  formesCreuses = random() > 0.7;
  epaisseurContour = random() > 0.5 ? floor(random(1, 8)) : 0;
  if (curseurEpaisseur) curseurEpaisseur.value(epaisseurContour);
  if (valeurEpaisseur) valeurEpaisseur.html(epaisseurContour.toFixed(1) + ' px');
  
  melangerFormes = afficherCercles || afficherCarres || afficherTriangles;
  updateAllPaletteUI();
  
  // Régénérer la composition avec le nouveau seed
  genererNouveauMotif();
}

// ============================================================================
// FONCTION : genererNouveauMotif()
// ============================================================================
function genererNouveauMotif() {
  // Utiliser le seed pour générer une composition stable
  randomSeed(seedMotif);
  
  cg = createGraphics(width, height);
  cg.rectMode(CENTER);
  
  for (let index = 0; index < 100; index++) {
    let radius = random(70, 100);
    cg.fill(random(255), random(255), random(255));
    cg.circle(random(width), random(height), radius);
  }
  
  // Réinitialiser randomSeed pour permettre la variation lors du dessin
  randomSeed();
  
  necesiteRedessiner = true;
}

// ============================================================================
// FONCTION : dessinerCMYK()
// ============================================================================
function dessinerCMYK() {
  // Utiliser le seed pour avoir les MÊMES positions de formes
  randomSeed(seedMotif);
  
  blendMode(BLEND);
  background(230, 230, 230);
  noStroke();
  colorMode(RGB);

  let diff = 8;
  let spotamp = random(20, 40);

  if (typeDisposition === 'grille') {
    dessinerDispositionGrille(diff, spotamp);
  } else if (typeDisposition === 'aleatoire') {
    dessinerDispositionAleatoire(diff, spotamp);
  }
  
  // Réinitialiser randomSeed après le dessin
  randomSeed();
}

// ============================================================================
// FONCTION : dessinerDispositionGrille()
// ============================================================================
function dessinerDispositionGrille(diff, spotamp) {
  for (let Y = 50; Y < height - 50; Y = Y + densite) {
    for (let X = 50; X < width - 50; X = X + densite) {
      dessinerPointCMYK(X, Y, diff, spotamp);
    }
  }
}

// ============================================================================
// FONCTION : dessinerDispositionAleatoire()
// ============================================================================
function dessinerDispositionAleatoire(diff, spotamp) {
  for (let Y = 50; Y < height - 50; Y = Y + densite) {
    for (let X = 50; X < width - 50; X = X + densite) {
      let randX = X + random(-densite * 0.3, densite * 0.3);
      let randY = Y + random(-densite * 0.3, densite * 0.3);
      dessinerPointCMYK(randX, randY, diff, spotamp);
    }
  }
}

// ============================================================================
// FONCTION : dessinerPointCMYK()
// ============================================================================
function dessinerPointCMYK(X, Y, diff, spotamp) {
  let thisRGB = cg.get(X, Y);
  let thisCMYK = convertirRGBenCMYK(thisRGB[0], thisRGB[1], thisRGB[2]);
  let CMYKspotsize = convertirCMYKenTaillePoint(...thisCMYK, spotamp);
  
  dessinerForme(X, Y - diff, CMYKspotsize[3], black, 'noir');
  dessinerForme(X - diff, Y, CMYKspotsize[0], cyan, 'cyan');
  dessinerForme(X, Y + diff, CMYKspotsize[1], magenta, 'magenta');
  dessinerForme(X + diff, Y, CMYKspotsize[2], yellow, 'jaune');
}

// ============================================================================
// FONCTION : dessinerForme()
// ============================================================================
function dessinerForme(x, y, size, col, position) {
  let a = opaciteForme * 255;
  let r = red(col), g = green(col), b = blue(col);

  let formesDisponibles = [];
  if (afficherCercles) formesDisponibles.push('cercle');
  if (afficherCarres) formesDisponibles.push('carre');
  if (afficherTriangles) formesDisponibles.push('triangle');

  let formeADessiner = 'cercle';
  if (formesDisponibles.length > 0) {
    formeADessiner = random(formesDisponibles);
  }

  // Appliquer l'échelle individuelle selon le type de forme
  if (formeADessiner === 'cercle') {
    size = unifierCercles ? (20 * echelleCercles) : (size * echelleCercles);
  } else if (formeADessiner === 'carre') {
    size = unifierCarres ? (20 * echelleCarres) : (size * echelleCarres);
  } else if (formeADessiner === 'triangle') {
    size = unifierTriangles ? (20 * echelleTriangles) : (size * echelleTriangles);
  }

  push();

  if (formesCreuses) {
    if (epaisseurContour > 0) {
      stroke(r, g, b, a);
      strokeWeight(epaisseurContour);
    } else {
      noStroke();
    }
    noFill();
  } else {
    noStroke();
    fill(r, g, b, a);
  }

  if (formeADessiner === 'cercle') {
    circle(x, y, size);
  } else if (formeADessiner === 'carre') {
    rectMode(CENTER);
    square(x, y, size);
  } else if (formeADessiner === 'triangle') {
    let h = size * sqrt(3) / 2;
    triangle(
      x, y - h / 2,
      x - size / 2, y + h / 2,
      x + size / 2, y + h / 2
    );
  }

  pop();
}

// ============================================================================
// FONCTION : windowResized()
// ============================================================================
function windowResized() {
  resizeCanvas(windowWidth - largeurPanneau, windowHeight);
  necesiteRedessiner = true;
}

// ============================================================================
// FONCTION : convertirRGBenCMYK()
// ============================================================================
function convertirRGBenCMYK(r, g, b) {
  let r1 = r / 255, g1 = g / 255, b1 = b / 255;
  let c, m, y, k;
  k = min(1 - r1, 1 - g1, 1 - b1);
  
  if (k == 1) {
    c = m = y = 0;
  } else {
    c = (1 - r1 - k) / (1 - k);
    m = (1 - g1 - k) / (1 - k);
    y = (1 - b1 - k) / (1 - k);
  }
  
  return [c, m, y, k];
}

// ============================================================================
// FONCTION : convertirCMYKenTaillePoint()
// ============================================================================
function convertirCMYKenTaillePoint(c, m, y, k, spotSize) {
  let circleRad = spotSize;
  let cs = map(c, 0, 1, 0, circleRad);
  let ms = map(m, 0, 1, 0, circleRad);
  let ys = map(y, 0, 1, 0, circleRad);
  let ks = map(k, 0, 1, 0, circleRad);
  return [cs, ms, ys, ks];
}

// ============================================================================
// FONCTIONS UTILITAIRES PALETTE
// ============================================================================
function normalizeHex(h) {
  if (!h) return null;
  h = h.trim();
  if (h[0] !== '#') h = '#' + h;
  if (/^#[0-9A-Fa-f]{6}$/.test(h)) return h;
  return null;
}

function rgbToHex(c) {
  try {
    let r = floor(red(c)), g = floor(green(c)), b = floor(blue(c));
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return '#000000';
  }
}

function setPaletteColor(index, hex) {
  if (!hex) return;
  if (index === 0) cyan = color(hex);
  else if (index === 1) magenta = color(hex);
  else if (index === 2) yellow = color(hex);
  else if (index === 3) black = color(hex);
}

function updatePreview(index) {
  let hex;
  if (index === 0) hex = rgbToHex(cyan);
  else if (index === 1) hex = rgbToHex(magenta);
  else if (index === 2) hex = rgbToHex(yellow);
  else if (index === 3) hex = rgbToHex(black);

  if (palettePickers[index]) palettePickers[index].value(hex);
  if (paletteInputs[index]) paletteInputs[index].value(hex);
  if (palettePreviews[index]) palettePreviews[index].style('background-color', hex);
}

function updateAllPaletteUI() {
  for (let i = 0; i < 4; i++) updatePreview(i);
}

function updateAllPreviews() {
  for (let i = 0; i < palettePreviews.length; i++) updatePreview(i);
}

// ============================================================================
// FONCTION : telechargerPNG()
// ============================================================================
function telechargerPNG() {
  let exportGraphics = createGraphics(1920, 1080);
  let cgTemp = createGraphics(1920, 1080);
  
  // Utiliser le seed pour la cohérence
  randomSeed(seedMotif);
  cgTemp.rectMode(CENTER);
  
  for (let index = 0; index < 100; index++) {
    let radius = random(70, 100);
    cgTemp.fill(random(255), random(255), random(255));
    cgTemp.circle(random(1920), random(1080), radius);
  }
  
  exportGraphics.blendMode(BLEND);
  exportGraphics.background(230, 230, 230);
  exportGraphics.noStroke();
  exportGraphics.colorMode(RGB);
  
  let diff = 8;
  let spotamp = random(20, 40);
  
  if (typeDisposition === 'grille') {
    for (let Y = 50; Y < 1080 - 50; Y = Y + densite) {
      for (let X = 50; X < 1920 - 50; X = X + densite) {
        dessinerPointCMYKExport(exportGraphics, cgTemp, X, Y, diff, spotamp);
      }
    }
  } else if (typeDisposition === 'aleatoire') {
    for (let Y = 50; Y < 1080 - 50; Y = Y + densite) {
      for (let X = 50; X < 1920 - 50; X = X + densite) {
        let randX = X + random(-densite * 0.3, densite * 0.3);
        let randY = Y + random(-densite * 0.3, densite * 0.3);
        dessinerPointCMYKExport(exportGraphics, cgTemp, randX, randY, diff, spotamp);
      }
    }
  }
  
  save(exportGraphics, 'mosaique-1920x1080.png');
  cgTemp.remove();
  exportGraphics.remove();
  
  randomSeed();
}

function dessinerPointCMYKExport(pg, source, X, Y, diff, spotamp) {
  let thisRGB = source.get(X, Y);
  let thisCMYK = convertirRGBenCMYK(thisRGB[0], thisRGB[1], thisRGB[2]);
  let CMYKspotsize = convertirCMYKenTaillePoint(...thisCMYK, spotamp);
  
  dessinerFormeExport(pg, X, Y - diff, CMYKspotsize[3], black, 'noir');
  dessinerFormeExport(pg, X - diff, Y, CMYKspotsize[0], cyan, 'cyan');
  dessinerFormeExport(pg, X, Y + diff, CMYKspotsize[1], magenta, 'magenta');
  dessinerFormeExport(pg, X + diff, Y, CMYKspotsize[2], yellow, 'jaune');
}

function dessinerFormeExport(pg, x, y, size, col, position) {
  let a = opaciteForme * 255;
  let r = red(col), g = green(col), b = blue(col);
  
  let formesDisponibles = [];
  if (afficherCercles) formesDisponibles.push('cercle');
  if (afficherCarres) formesDisponibles.push('carre');
  if (afficherTriangles) formesDisponibles.push('triangle');
  
  let formeADessiner = 'cercle';
  if (formesDisponibles.length > 0) {
    formeADessiner = random(formesDisponibles);
  }

  if (formeADessiner === 'cercle') {
    size = unifierCercles ? (20 * echelleCercles) : (size * echelleCercles);
  } else if (formeADessiner === 'carre') {
    size = unifierCarres ? (20 * echelleCarres) : (size * echelleCarres);
  } else if (formeADessiner === 'triangle') {
    size = unifierTriangles ? (20 * echelleTriangles) : (size * echelleTriangles);
  }
  
  pg.push();
  
  if (formesCreuses) {
    if (epaisseurContour > 0) {
      pg.stroke(r, g, b, a);
      pg.strokeWeight(epaisseurContour);
    } else {
      pg.noStroke();
    }
    pg.noFill();
  } else {
    pg.noStroke();
    pg.fill(r, g, b, a);
  }
  
  if (formeADessiner === 'cercle') {
    pg.circle(x, y, size);
  } else if (formeADessiner === 'carre') {
    pg.rectMode(CENTER);
    pg.square(x, y, size);
  } else if (formeADessiner === 'triangle') {
    let h = size * sqrt(3) / 2;
    pg.triangle(
      x, y - h / 2,
      x - size / 2, y + h / 2,
      x + size / 2, y + h / 2
    );
  }
  
  pg.pop();
}

