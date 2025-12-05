// ============================================================================
// GÉNÉRATEUR DE MOSAÏQUE — Configuration et Variables Globales
// ============================================================================

// ============================================================================
// SECTION 1 : VARIABLES DE COULEUR ET D'IMAGE
// ============================================================================
let preimage;
let cyan, magenta, yellow, black;
let cg;
let seedMotif = 42;

// ============================================================================
// SECTION 2 : VARIABLES DE PARAMÈTRES UTILISATEUR
// ============================================================================
let selecteurDisposition;
let curseurDensite;
let caseCercles, caseCarres, caseTriangles;
let curseurEchelleCercles, curseurEchelleCarres, curseurEchelleTriangles;
let conteneurCurseurCercles, conteneurCurseurCarres, conteneurCurseurTriangles;
let chevronCercles, chevronCarres, chevronTriangles;
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
let formesCrecsesCercles = false;
let formesCreusesCarres = false;
let formesCreusesTriangles = false;
let epaisseurContourCercles = 2; // MODIFIÉ : épaisseur individuelle
let epaisseurContourCarres = 2;
let epaisseurContourTriangles = 2;
// NOUVEAU : Opacité individuelle pour chaque forme
let opaciteFormeCercles = 1;
let opaciteFormeCarres = 1;
let opaciteFormeTriangles = 1;
let necesiteRedessiner = true;
let melangerFormes = true;
let afficherCercles = true;
let afficherCarres = true;
let afficherTriangles = true;

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

  // MODIFIÉ : Empêcher la propagation de l'événement click sur la checkbox
  caseCercles.elt.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // NOUVEAU : Conteneur pour le chevron (zone cliquable pour le toggle)
  let chevronContainerCercles = createDiv();
  chevronContainerCercles.parent(headerCercles);
  chevronContainerCercles.class('chevron-container');

  chevronCercles = createSpan('▶');
  chevronCercles.parent(chevronContainerCercles);
  chevronCercles.class('chevron');

  // MODIFIÉ : Clic uniquement sur le conteneur du chevron
  chevronContainerCercles.mousePressed(() => {
    toggleCurseur(conteneurCurseurCercles, chevronCercles);
  });

  // SUPPRIMÉ : headerCercles.mousePressed()

  conteneurCurseurCercles = createDiv();
  conteneurCurseurCercles.parent(conteneurCercles);
  conteneurCurseurCercles.class('curseur-container');

  // Taille
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

  // NOUVEAU : Opacité
  let labelOpaciteCercles = createP('Opacité');
  labelOpaciteCercles.parent(conteneurCurseurCercles);
  labelOpaciteCercles.class('mini-label');

  let curseurOpaciteCercles = createSlider(0, 1, 1, 0.01);
  curseurOpaciteCercles.parent(conteneurCurseurCercles);
  curseurOpaciteCercles.input(() => {
    opaciteFormeCercles = curseurOpaciteCercles.value();
    valeurOpaciteCercles.html(opaciteFormeCercles.toFixed(2));
    necesiteRedessiner = true;
  });

  let valeurOpaciteCercles = createP(opaciteFormeCercles.toFixed(2));
  valeurOpaciteCercles.parent(conteneurCurseurCercles);
  valeurOpaciteCercles.class('mini-valeur');

  // Toggle unification taille
  let toggleContainerUnifierCercles = createDiv();
  toggleContainerUnifierCercles.parent(conteneurCurseurCercles);
  toggleContainerUnifierCercles.class('toggle-container');

  let toggleLabelUnifierCercles = createSpan('Taille uniforme');
  toggleLabelUnifierCercles.parent(toggleContainerUnifierCercles);
  toggleLabelUnifierCercles.class('toggle-label');

  let toggleSwitchUnifierCercles = createDiv();
  toggleSwitchUnifierCercles.parent(toggleContainerUnifierCercles);
  toggleSwitchUnifierCercles.class('toggle-switch');

  let checkboxUnifierCercles = createInput();
  checkboxUnifierCercles.attribute('type', 'checkbox');
  checkboxUnifierCercles.parent(toggleSwitchUnifierCercles);
  checkboxUnifierCercles.changed(() => {
    unifierCercles = checkboxUnifierCercles.elt.checked;
    necesiteRedessiner = true;
  });

  let sliderUnifierCercles = createSpan('');
  sliderUnifierCercles.parent(toggleSwitchUnifierCercles);
  sliderUnifierCercles.class('toggle-slider');

  // Toggle formes creuses
  let toggleContainerCreuxCercles = createDiv();
  toggleContainerCreuxCercles.parent(conteneurCurseurCercles);
  toggleContainerCreuxCercles.class('toggle-container');

  let toggleLabelCreuxCercles = createSpan('Tracé uniquement');
  toggleLabelCreuxCercles.parent(toggleContainerCreuxCercles);
  toggleLabelCreuxCercles.class('toggle-label');

  let toggleSwitchCreuxCercles = createDiv();
  toggleSwitchCreuxCercles.parent(toggleContainerCreuxCercles);
  toggleSwitchCreuxCercles.class('toggle-switch');

  let checkboxCreuxCercles = createInput();
  checkboxCreuxCercles.attribute('type', 'checkbox');
  checkboxCreuxCercles.parent(toggleSwitchCreuxCercles);
  checkboxCreuxCercles.changed(() => {
    formesCrecsesCercles = checkboxCreuxCercles.elt.checked;
    necesiteRedessiner = true;
  });

  let sliderCreuxCercles = createSpan('');
  sliderCreuxCercles.parent(toggleSwitchCreuxCercles);
  sliderCreuxCercles.class('toggle-slider');

  // NOUVEAU : Épaisseur du tracé pour cercles
  let labelEpaisseurCercles = createP('Épaisseur tracé (px)');
  labelEpaisseurCercles.parent(conteneurCurseurCercles);
  labelEpaisseurCercles.class('mini-label');

  let curseurEpaisseurCercles = createSlider(0.5, 10, 2, 0.5);
  curseurEpaisseurCercles.parent(conteneurCurseurCercles);
  curseurEpaisseurCercles.input(() => {
    epaisseurContourCercles = curseurEpaisseurCercles.value();
    valeurEpaisseurCercles.html(epaisseurContourCercles.toFixed(1) + ' px');
    necesiteRedessiner = true;
  });

  let valeurEpaisseurCercles = createP(epaisseurContourCercles.toFixed(1) + ' px');
  valeurEpaisseurCercles.parent(conteneurCurseurCercles);
  valeurEpaisseurCercles.class('mini-valeur');

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

  // NOUVEAU : Conteneur pour le chevron
  let chevronContainerCarres = createDiv();
  chevronContainerCarres.parent(headerCarres);
  chevronContainerCarres.class('chevron-container');

  chevronCarres = createSpan('▶');
  chevronCarres.parent(chevronContainerCarres);
  chevronCarres.class('chevron');

  chevronContainerCarres.mousePressed(() => {
    toggleCurseur(conteneurCurseurCarres, chevronCarres);
  });

  conteneurCurseurCarres = createDiv();
  conteneurCurseurCarres.parent(conteneurCarres);
  conteneurCurseurCarres.class('curseur-container');

  // Taille
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

  // NOUVEAU : Opacité
  let labelOpaciteCarres = createP('Opacité');
  labelOpaciteCarres.parent(conteneurCurseurCarres);
  labelOpaciteCarres.class('mini-label');

  let curseurOpaciteCarres = createSlider(0, 1, 1, 0.01);
  curseurOpaciteCarres.parent(conteneurCurseurCarres);
  curseurOpaciteCarres.input(() => {
    opaciteFormeCarres = curseurOpaciteCarres.value();
    valeurOpaciteCarres.html(opaciteFormeCarres.toFixed(2));
    necesiteRedessiner = true;
  });

  let valeurOpaciteCarres = createP(opaciteFormeCarres.toFixed(2));
  valeurOpaciteCarres.parent(conteneurCurseurCarres);
  valeurOpaciteCarres.class('mini-valeur');

  // Toggle unification taille
  let toggleContainerUnifierCarres = createDiv();
  toggleContainerUnifierCarres.parent(conteneurCurseurCarres);
  toggleContainerUnifierCarres.class('toggle-container');

  let toggleLabelUnifierCarres = createSpan('Taille uniforme');
  toggleLabelUnifierCarres.parent(toggleContainerUnifierCarres);
  toggleLabelUnifierCarres.class('toggle-label');

  let toggleSwitchUnifierCarres = createDiv();
  toggleSwitchUnifierCarres.parent(toggleContainerUnifierCarres);
  toggleSwitchUnifierCarres.class('toggle-switch');

  let checkboxUnifierCarres = createInput();
  checkboxUnifierCarres.attribute('type', 'checkbox');
  checkboxUnifierCarres.parent(toggleSwitchUnifierCarres);
  checkboxUnifierCarres.changed(() => {
    unifierCarres = checkboxUnifierCarres.elt.checked;
    necesiteRedessiner = true;
  });

  let sliderUnifierCarres = createSpan('');
  sliderUnifierCarres.parent(toggleSwitchUnifierCarres);
  sliderUnifierCarres.class('toggle-slider');

  // Toggle formes creuses
  let toggleContainerCreuxCarres = createDiv();
  toggleContainerCreuxCarres.parent(conteneurCurseurCarres);
  toggleContainerCreuxCarres.class('toggle-container');

  let toggleLabelCreuxCarres = createSpan('Tracé uniquement');
  toggleLabelCreuxCarres.parent(toggleContainerCreuxCarres);
  toggleLabelCreuxCarres.class('toggle-label');

  let toggleSwitchCreuxCarres = createDiv();
  toggleSwitchCreuxCarres.parent(toggleContainerCreuxCarres);
  toggleSwitchCreuxCarres.class('toggle-switch');

  let checkboxCreuxCarres = createInput();
  checkboxCreuxCarres.attribute('type', 'checkbox');
  checkboxCreuxCarres.parent(toggleSwitchCreuxCarres);
  checkboxCreuxCarres.changed(() => {
    formesCreusesCarres = checkboxCreuxCarres.elt.checked;
    necesiteRedessiner = true;
  });

  let sliderCreuxCarres = createSpan('');
  sliderCreuxCarres.parent(toggleSwitchCreuxCarres);
  sliderCreuxCarres.class('toggle-slider');

  // NOUVEAU : Épaisseur du tracé pour carrés
  let labelEpaisseurCarres = createP('Épaisseur tracé (px)');
  labelEpaisseurCarres.parent(conteneurCurseurCarres);
  labelEpaisseurCarres.class('mini-label');

  let curseurEpaisseurCarres = createSlider(0.5, 10, 2, 0.5);
  curseurEpaisseurCarres.parent(conteneurCurseurCarres);
  curseurEpaisseurCarres.input(() => {
    epaisseurContourCarres = curseurEpaisseurCarres.value();
    valeurEpaisseurCarres.html(epaisseurContourCarres.toFixed(1) + ' px');
    necesiteRedessiner = true;
  });

  let valeurEpaisseurCarres = createP(epaisseurContourCarres.toFixed(1) + ' px');
  valeurEpaisseurCarres.parent(conteneurCurseurCarres);
  valeurEpaisseurCarres.class('mini-valeur');

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

  // NOUVEAU : Conteneur pour le chevron
  let chevronContainerTriangles = createDiv();
  chevronContainerTriangles.parent(headerTriangles);
  chevronContainerTriangles.class('chevron-container');

  chevronTriangles = createSpan('▶');
  chevronTriangles.parent(chevronContainerTriangles);
  chevronTriangles.class('chevron');

  chevronContainerTriangles.mousePressed(() => {
    toggleCurseur(conteneurCurseurTriangles, chevronTriangles);
  });

  conteneurCurseurTriangles = createDiv();
  conteneurCurseurTriangles.parent(conteneurTriangles);
  conteneurCurseurTriangles.class('curseur-container');

  // Taille
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

  // NOUVEAU : Opacité
  let labelOpaciteTriangles = createP('Opacité');
  labelOpaciteTriangles.parent(conteneurCurseurTriangles);
  labelOpaciteTriangles.class('mini-label');

  let curseurOpaciteTriangles = createSlider(0, 1, 1, 0.01);
  curseurOpaciteTriangles.parent(conteneurCurseurTriangles);
  curseurOpaciteTriangles.input(() => {
    opaciteFormeTriangles = curseurOpaciteTriangles.value();
    valeurOpaciteTriangles.html(opaciteFormeTriangles.toFixed(2));
    necesiteRedessiner = true;
  });

  let valeurOpaciteTriangles = createP(opaciteFormeTriangles.toFixed(2));
  valeurOpaciteTriangles.parent(conteneurCurseurTriangles);
  valeurOpaciteTriangles.class('mini-valeur');

  // Toggle unification taille
  let toggleContainerUnifierTriangles = createDiv();
  toggleContainerUnifierTriangles.parent(conteneurCurseurTriangles);
  toggleContainerUnifierTriangles.class('toggle-container');

  let toggleLabelUnifierTriangles = createSpan('Taille uniforme');
  toggleLabelUnifierTriangles.parent(toggleContainerUnifierTriangles);
  toggleLabelUnifierTriangles.class('toggle-label');

  let toggleSwitchUnifierTriangles = createDiv();
  toggleSwitchUnifierTriangles.parent(toggleContainerUnifierTriangles);
  toggleSwitchUnifierTriangles.class('toggle-switch');

  let checkboxUnifierTriangles = createInput();
  checkboxUnifierTriangles.attribute('type', 'checkbox');
  checkboxUnifierTriangles.parent(toggleSwitchUnifierTriangles);
  checkboxUnifierTriangles.changed(() => {
    unifierTriangles = checkboxUnifierTriangles.elt.checked;
    necesiteRedessiner = true;
  });

  let sliderUnifierTriangles = createSpan('');
  sliderUnifierTriangles.parent(toggleSwitchUnifierTriangles);
  sliderUnifierTriangles.class('toggle-slider');

  // Toggle formes creuses
  let toggleContainerCreuxTriangles = createDiv();
  toggleContainerCreuxTriangles.parent(conteneurCurseurTriangles);
  toggleContainerCreuxTriangles.class('toggle-container');

  let toggleLabelCreuxTriangles = createSpan('Tracé uniquement');
  toggleLabelCreuxTriangles.parent(toggleContainerCreuxTriangles);
  toggleLabelCreuxTriangles.class('toggle-label');

  let toggleSwitchCreuxTriangles = createDiv();
  toggleSwitchCreuxTriangles.parent(toggleContainerCreuxTriangles);
  toggleSwitchCreuxTriangles.class('toggle-switch');

  let checkboxCreuxTriangles = createInput();
  checkboxCreuxTriangles.attribute('type', 'checkbox');
  checkboxCreuxTriangles.parent(toggleSwitchCreuxTriangles);
  checkboxCreuxTriangles.changed(() => {
    formesCreusesTriangles = checkboxCreuxTriangles.elt.checked;
    necesiteRedessiner = true;
  });

  let sliderCreuxTriangles = createSpan('');
  sliderCreuxTriangles.parent(toggleSwitchCreuxTriangles);
  sliderCreuxTriangles.class('toggle-slider');

  // NOUVEAU : Épaisseur du tracé pour triangles
  let labelEpaisseurTriangles = createP('Épaisseur tracé (px)');
  labelEpaisseurTriangles.parent(conteneurCurseurTriangles);
  labelEpaisseurTriangles.class('mini-label');

  let curseurEpaisseurTriangles = createSlider(0.5, 10, 2, 0.5);
  curseurEpaisseurTriangles.parent(conteneurCurseurTriangles);
  curseurEpaisseurTriangles.input(() => {
    epaisseurContourTriangles = curseurEpaisseurTriangles.value();
    valeurEpaisseurTriangles.html(epaisseurContourTriangles.toFixed(1) + ' px');
    necesiteRedessiner = true;
  });

  let valeurEpaisseurTriangles = createP(epaisseurContourTriangles.toFixed(1) + ' px');
  valeurEpaisseurTriangles.parent(conteneurCurseurTriangles);
  valeurEpaisseurTriangles.class('mini-valeur');

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

  // ===== CONTRÔLE 4 : PALETTE DE COULEURS =====
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
// FONCTION : genererNouveauMotifAleatoire()
// ============================================================================
function genererNouveauMotifAleatoire() {
  // Générer un nouveau seed AVANT d'appeler random()
  seedMotif = floor(random(100000));

  // Randomiser les couleurs
  cyan = color(random(255), random(255), random(255));
  magenta = color(random(255), random(255), random(255));
  yellow = color(random(255), random(255), random(255));
  black = color(random(255), random(255), random(255));

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
  
  // MODIFIÉ : Randomiser les opacités individuelles
  opaciteFormeCercles = round(random(0.3, 1) * 100) / 100;
  opaciteFormeCarres = round(random(0.3, 1) * 100) / 100;
  opaciteFormeTriangles = round(random(0.3, 1) * 100) / 100;
  
  // Randomiser les formes affichées
  afficherCercles = random() > 0.3;
  afficherCarres = random() > 0.3;
  afficherTriangles = random() > 0.3;
  
  // S'assurer qu'au moins UNE forme est affichée
  if (!afficherCercles && !afficherCarres && !afficherTriangles) {
    let formeAleatoire = floor(random(3));
    if (formeAleatoire === 0) afficherCercles = true;
    else if (formeAleatoire === 1) afficherCarres = true;
    else afficherTriangles = true;
  }
  
  if (caseCercles) caseCercles.checked(afficherCercles);
  if (caseCarres) caseCarres.checked(afficherCarres);
  if (caseTriangles) caseTriangles.checked(afficherTriangles);
  
  // Randomiser les états d'unification taille
  unifierCercles = random() > 0.7;
  unifierCarres = random() > 0.7;
  unifierTriangles = random() > 0.7;

  // Mettre à jour les checkboxes d'unification
  let allCheckboxes = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
  if (allCheckboxes.length >= 3) {
    allCheckboxes[0].checked = unifierCercles;
    allCheckboxes[1].checked = unifierCarres;
    allCheckboxes[2].checked = unifierTriangles;
  }
  
  // Randomiser les formes creuses individuelles
  formesCrecsesCercles = random() > 0.7;
  formesCreusesCarres = random() > 0.7;
  formesCreusesTriangles = random() > 0.7;

  // Mettre à jour les checkboxes de formes creuses
  if (allCheckboxes.length >= 6) {
    allCheckboxes[3].checked = formesCrecsesCercles;
    allCheckboxes[4].checked = formesCreusesCarres;
    allCheckboxes[5].checked = formesCreusesTriangles;
  }
  
  // NOUVEAU : Randomiser les épaisseurs
  epaisseurContourCercles = round(random(0.5, 8) * 2) / 2;
  epaisseurContourCarres = round(random(0.5, 8) * 2) / 2;
  epaisseurContourTriangles = round(random(0.5, 8) * 2) / 2;
  
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
  // Vérifier qu'on a au moins une forme à afficher
  melangerFormes = afficherCercles || afficherCarres || afficherTriangles;
  if (!melangerFormes) {
    afficherCercles = true;
    melangerFormes = true;
  }
  
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
// FONCTION : dessinerForme() - AVEC OPACITÉ PAR TYPE DE FORME (CORRIGÉ)
// ============================================================================
function dessinerForme(x, y, size, col, position) {
  let r = red(col), g = green(col), b = blue(col);

  let formesDisponibles = [];
  if (afficherCercles) formesDisponibles.push('cercle');
  if (afficherCarres) formesDisponibles.push('carre');
  if (afficherTriangles) formesDisponibles.push('triangle');

  // Si aucune forme n'est disponible, afficher au moins des cercles
  if (formesDisponibles.length === 0) {
    formesDisponibles.push('cercle');
  }

  let formeADessiner = random(formesDisponibles);

  // CORRIGÉ : Appliquer l'opacité selon le TYPE DE FORME choisi
  let opacite = 1;
  if (formeADessiner === 'cercle') {
    opacite = opaciteFormeCercles;
    size = unifierCercles ? (20 * echelleCercles) : (size * echelleCercles);
  } else if (formeADessiner === 'carre') {
    opacite = opaciteFormeCarres;
    size = unifierCarres ? (20 * echelleCarres) : (size * echelleCarres);
  } else if (formeADessiner === 'triangle') {
    opacite = opaciteFormeTriangles;
    size = unifierTriangles ? (20 * echelleTriangles) : (size * echelleTriangles);
  }

  let a = opacite * 255;

  push();

  // Déterminer si la forme doit être creuse selon son type
  let estCreuse = false;
  let epaisseurContour = 0;
  
  if (formeADessiner === 'cercle') {
    estCreuse = formesCrecsesCercles;
    epaisseurContour = epaisseurContourCercles;
  } else if (formeADessiner === 'carre') {
    estCreuse = formesCreusesCarres;
    epaisseurContour = epaisseurContourCarres;
  } else if (formeADessiner === 'triangle') {
    estCreuse = formesCreusesTriangles;
    epaisseurContour = epaisseurContourTriangles;
  }

  if (estCreuse) {
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
// FONCTION : dessinerFormeExport() - AVEC OPACITÉ PAR TYPE DE FORME (CORRIGÉ)
// ============================================================================
function dessinerFormeExport(pg, x, y, size, col, position) {
  let r = red(col), g = green(col), b = blue(col);
  
  let formesDisponibles = [];
  if (afficherCercles) formesDisponibles.push('cercle');
  if (afficherCarres) formesDisponibles.push('carre');
  if (afficherTriangles) formesDisponibles.push('triangle');
  
  if (formesDisponibles.length === 0) {
    formesDisponibles.push('cercle');
  }

  let formeADessiner = random(formesDisponibles);

  // CORRIGÉ : Appliquer l'opacité selon le TYPE DE FORME choisi
  let opacite = 1;
  if (formeADessiner === 'cercle') {
    opacite = opaciteFormeCercles;
    size = unifierCercles ? (20 * echelleCercles) : (size * echelleCercles);
  } else if (formeADessiner === 'carre') {
    opacite = opaciteFormeCarres;
    size = unifierCarres ? (20 * echelleCarres) : (size * echelleCarres);
  } else if (formeADessiner === 'triangle') {
    opacite = opaciteFormeTriangles;
    size = unifierTriangles ? (20 * echelleTriangles) : (size * echelleTriangles);
  }

  let a = opacite * 255;
  
  pg.push();
  
  // Déterminer si la forme doit être creuse selon son type
  let estCreuse = false;
  let epaisseurContour = 0;
  
  if (formeADessiner === 'cercle') {
    estCreuse = formesCrecsesCercles;
    epaisseurContour = epaisseurContourCercles;
  } else if (formeADessiner === 'carre') {
    estCreuse = formesCreusesCarres;
    epaisseurContour = epaisseurContourCarres;
  } else if (formeADessiner === 'triangle') {
    estCreuse = formesCreusesTriangles;
    epaisseurContour = epaisseurContourTriangles;
  }

  if (estCreuse) {
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

