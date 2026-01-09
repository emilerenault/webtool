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
let largeurPanneau = 340;
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
let afficherTriangles = false;

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
  let titreContainer = createDiv();
  titreContainer.parent(panneauControle);
  titreContainer.class('titre-container');

  let titre = createP('Générateur de mosaïque');
  titre.parent(titreContainer);
  titre.class('titre');
  titre.style('margin', '0').style('padding-bottom', '0').style('border-bottom', 'none');

  let infoBtn = createButton('i');
  infoBtn.parent(titreContainer);
  infoBtn.class('info-btn');
  infoBtn.mousePressed(() => {
    const modalEl = document.getElementById('info-modal');
    const modalContentEl = modalEl.querySelector('.modal-content');
    // Réinitialiser l'état de fermeture et afficher
    modalEl.classList.remove('closing');
    modalContentEl.classList.remove('closing');
    modalEl.style.display = 'flex';
  });

  // Créer le modal d'information
  let modal = createDiv();
  modal.id('info-modal');
  modal.class('modal');
  modal.elt.innerHTML = `
    <div class="modal-content">
      <span class="modal-close">&times;</span>
      <h2>À propos</h2>
      <p>Cet outil génère des compositions visuelles basées sur un système de formes géométriques et de couleurs CMYK. Chaque élément est positionné selon une grille ou une disposition libre, permettant de créer des patterns uniques et des mosaïques graphiques personnalisables.</p>
      <p>Le principe est fondé sur la répétition de formes géométriques simples (ronds, carrés, triangles), offrant un contrôle fin sur la densité, la taille, la transparence et le style de chaque forme.</p>
      <hr>
      <p class="credit"><strong>Crédit artistique</strong><br>Cette approche visuelle s'inspire du travail de <a href="https://p5js.org/sketches/2225254/" target="_blank" rel="noopener">Yutorehito_</a>, artiste dont les explorations génératives autour des formes et des couleurs ont guidé le développement de cet outil.</p>
      <p class="credit"><strong>Typographie</strong><br><a href="https://fonts.google.com/specimen/Fredoka" target="_blank" rel="noopener">Fredoka</a> — Google Fonts</p>
      <hr>
      <p class="signature">Projet étudiant en web design réalisé par <a href="https://www.linkedin.com/in/emilerenault" target="_blank" rel="noopener">Emile Renault</a></p>
    </div>
  `;
  modal.parent(document.body);

  // Gérer la fermeture du modal (animation inverse)
  function closeInfoModal() {
    const modalEl = document.getElementById('info-modal');
    const modalContentEl = modalEl.querySelector('.modal-content');
    modalEl.classList.add('closing');
    modalContentEl.classList.add('closing');
    modalContentEl.addEventListener('animationend', () => {
      modalEl.style.display = 'none';
      modalEl.classList.remove('closing');
      modalContentEl.classList.remove('closing');
    }, { once: true });
  }

  document.querySelector('.modal-close').onclick = closeInfoModal;

  document.getElementById('info-modal').onclick = function(event) {
    if (event.target.id === 'info-modal') {
      closeInfoModal();
    }
  };

  // ===== SECTION 1 : DISPOSITION =====
  let sectionDisposition = createDiv();
  sectionDisposition.parent(panneauControle);
  sectionDisposition.style('display', 'flex').style('flex-direction', 'column').style('gap', '12px');

  let labelDisposition = createP('Disposition');
  labelDisposition.parent(sectionDisposition);
  labelDisposition.class('section-heading');
  labelDisposition.style('margin', '0');

  let dispositionButtons = createDiv();
  dispositionButtons.parent(sectionDisposition);
  dispositionButtons.class('disposition-buttons');

  let btnGrille = createButton('Grille');
  btnGrille.parent(dispositionButtons);
  btnGrille.class('disposition-btn active');
  btnGrille.style('flex', '1');
  btnGrille.mousePressed(() => {
    typeDisposition = 'grille';
    document.querySelectorAll('.disposition-btn').forEach(b => b.classList.remove('active'));
    btnGrille.elt.classList.add('active');
    necesiteRedessiner = true;
  });

  let btnAleatoire = createButton('Libre');
  btnAleatoire.parent(dispositionButtons);
  btnAleatoire.class('disposition-btn');
  btnAleatoire.style('flex', '1');
  btnAleatoire.mousePressed(() => {
    typeDisposition = 'aleatoire';
    document.querySelectorAll('.disposition-btn').forEach(b => b.classList.remove('active'));
    btnAleatoire.elt.classList.add('active');
    necesiteRedessiner = true;
  });

  // ===== SECTION 2 : DENSITÉ =====
  let sectionDensite = createDiv();
  sectionDensite.parent(panneauControle);
  sectionDensite.style('display', 'flex').style('flex-direction', 'column').style('gap', '12px');

  let labelDensite = createP('Densité');
  labelDensite.parent(sectionDensite);
  labelDensite.class('section-heading');
  labelDensite.style('margin', '0');

  let densiteContainer = createDiv();
  densiteContainer.parent(sectionDensite);
  densiteContainer.class('slider-group');

  // Slider inversé: 0-100 où 100 = beaucoup de formes, 0 = peu
  // On stocke la valeur réelle de densité (5-55px) mais le slider va de 0 à 100 (%) 
  curseurDensite = createSlider(0, 100, 100 - (densite - 5) * 2, 1);
  curseurDensite.parent(densiteContainer);
  curseurDensite.class('slider');
  curseurDensite.style('flex', '1');

  let valeurDensite = createDiv((curseurDensite.value()) + '%');
  valeurDensite.parent(densiteContainer);
  valeurDensite.class('slider-value');

  curseurDensite.input(() => {
    // Inverser: 100% - valeur pour que plus on va à droite, plus il y a de formes
    let sliderValue = curseurDensite.value();
    densite = 55 - (sliderValue * 0.5); // Convertir le pourcentage en espacement (5-55px)
    valeurDensite.html(sliderValue + '%');
    necesiteRedessiner = true;
  });

  // ===== SECTION 3 : FORMES =====
  let sectionFormes = createDiv();
  sectionFormes.parent(panneauControle);
  sectionFormes.style('display', 'flex').style('flex-direction', 'column').style('gap', '0');

  let labelFormes = createP('Formes');
  labelFormes.parent(sectionFormes);
  labelFormes.class('section-heading');
  labelFormes.style('margin', '0 0 12px 0');

  const shapesConfig = {
    cercle: { label: 'Rond', icon: '●' },
    carre: { label: 'Carré', icon: '■' },
    triangle: { label: 'Triangle', icon: '▲' }
  };

  let activeShape = 'cercle';

  // Rangée d'icônes (toggle affichage des formes)
  let shapeToggleRow = createDiv();
  shapeToggleRow.parent(sectionFormes);
  shapeToggleRow.class('shape-toggle-row');

  let shapeToggleRefs = {};

  Object.entries(shapesConfig).forEach(([key, config]) => {
    let toggleBtn = createButton('');
    toggleBtn.parent(shapeToggleRow);
    toggleBtn.class('shape-toggle-btn');
    toggleBtn.elt.classList.add(`shape-toggle-btn--${key}`);
    toggleBtn.elt.innerHTML = `<span class="shape-toggle-icon">${config.icon}</span>`;

    toggleBtn.mousePressed(() => {
      if (key === 'cercle') {
        afficherCercles = !afficherCercles;
      } else if (key === 'carre') {
        afficherCarres = !afficherCarres;
      } else if (key === 'triangle') {
        afficherTriangles = !afficherTriangles;
      }
      melangerFormes = afficherCercles || afficherCarres || afficherTriangles;
      updateToggleStates();
      updateShapeSettingsOpacity();
      necesiteRedessiner = true;
    });

    shapeToggleRefs[key] = toggleBtn;
  });

  function updateToggleStates() {
    Object.entries(shapeToggleRefs).forEach(([key, btn]) => {
      let isActive = key === 'cercle' ? afficherCercles : key === 'carre' ? afficherCarres : afficherTriangles;
      btn.elt.classList.toggle('active', isActive);
      btn.elt.classList.toggle('inactive', !isActive);
    });
  }

  function updateShapeSettingsOpacity() {
    let shapeSettingsContainer = document.getElementById('shape-settings-container');
    if (shapeSettingsContainer) {
      let isShapeActive = (activeShape === 'cercle' && afficherCercles) ||
                          (activeShape === 'carre' && afficherCarres) ||
                          (activeShape === 'triangle' && afficherTriangles);
      shapeSettingsContainer.classList.toggle('inactive', !isShapeActive);
    }
  }

  updateToggleStates();

  // Onglets texte pour choisir la forme à régler
  let shapesGrid = createDiv();
  shapesGrid.parent(sectionFormes);
  shapesGrid.class('shapes-grid');

  let shapeTabRefs = {};

  Object.entries(shapesConfig).forEach(([key, config]) => {
    let tabBtn = createButton(config.label);
    tabBtn.parent(shapesGrid);
    tabBtn.class('shape-tab-btn');
    tabBtn.elt.classList.add(`shape-tab-btn--${key}`);
    if (key === activeShape) tabBtn.elt.classList.add('active-tab');

    tabBtn.mousePressed(() => {
      activeShape = key;
      document.querySelectorAll('.shape-tab-btn').forEach(btn => btn.classList.remove('active-tab'));
      tabBtn.elt.classList.add('active-tab');
      updateShapeSettings(key);
      updateShapeSettingsOpacity();
    });

    shapeTabRefs[key] = tabBtn;
  });

  // Conteneur pour les réglages de la forme active
  let shapeSettingsContainer = createDiv();
  shapeSettingsContainer.parent(sectionFormes);
  shapeSettingsContainer.id('shape-settings-container');
  shapeSettingsContainer.class('shape-settings');

  // Initialiser les réglages de la première forme
  updateShapeSettings('cercle');

  // Fonction interne pour mettre à jour les réglages des formes
  function updateShapeSettings(shapeType) {
    let panneauControle = document.getElementById('panneauControle');
    let scrollPosition = panneauControle.scrollTop;
    
    let container = document.getElementById('shape-settings-container');
    container.innerHTML = '';

    // STYLE
    let styleGroup = createDiv();
    styleGroup.parent(container);
    styleGroup.class('settings-group style-group');
    let styleLabel = createP('Style');
    styleLabel.parent(styleGroup.elt);
    styleLabel.style('margin', '0').style('font-size', '14px').style('font-weight', '500').style('color', '#374151');

    let styleButtonGroup = createDiv();
    styleButtonGroup.parent(styleGroup.elt);
    styleButtonGroup.class('button-group');

    let isFill = (shapeType === 'cercle' && !formesCrecsesCercles) ||
                 (shapeType === 'carre' && !formesCreusesCarres) ||
                 (shapeType === 'triangle' && !formesCreusesTriangles);

    let btnFill = createButton('Remplissage');
    btnFill.parent(styleButtonGroup.elt);
    if (isFill) btnFill.elt.classList.add('active');
    btnFill.mousePressed(() => {
      if (shapeType === 'cercle') formesCrecsesCercles = false;
      else if (shapeType === 'carre') formesCreusesCarres = false;
      else if (shapeType === 'triangle') formesCreusesTriangles = false;
      document.querySelectorAll('#shape-settings-container .button-group button').forEach(b => b.classList.remove('active'));
      updateShapeSettings(shapeType);
      necesiteRedessiner = true;
    });

    let btnStroke = createButton('Tracé');
    btnStroke.parent(styleButtonGroup.elt);
    if (!isFill) btnStroke.elt.classList.add('active');
    btnStroke.mousePressed(() => {
      if (shapeType === 'cercle') formesCrecsesCercles = true;
      else if (shapeType === 'carre') formesCreusesCarres = true;
      else if (shapeType === 'triangle') formesCreusesTriangles = true;
      // Déclencher la mise à jour après un petit délai pour voir l'animation
      setTimeout(() => updateShapeSettings(shapeType), 10);
      necesiteRedessiner = true;
    });

    // ÉPAISSEUR DU TRACÉ (si applicable - juste après le style)
    let thicknessGroup = createDiv();
    thicknessGroup.parent(container);
    thicknessGroup.class('settings-group thickness-group');
    if (isFill === false) {
      thicknessGroup.elt.classList.add('show');
    }
    let thicknessLabel = createP('Épaisseur tracé');
    thicknessLabel.parent(thicknessGroup.elt);
    thicknessLabel.style('margin', '0').style('font-size', '14px').style('font-weight', '500').style('color', '#374151');

    let thicknessSliderGroup = createDiv();
    thicknessSliderGroup.parent(thicknessGroup.elt);
    thicknessSliderGroup.class('slider-group');

    let currentThickness = shapeType === 'cercle' ? epaisseurContourCercles : (shapeType === 'carre' ? epaisseurContourCarres : epaisseurContourTriangles);
    let thicknessSlider = createSlider(0.5, 10, currentThickness, 0.5);
    thicknessSlider.parent(thicknessSliderGroup.elt);
    thicknessSlider.class('slider');
    thicknessSlider.style('flex', '1');

    let thicknessValue = createDiv(currentThickness.toFixed(1) + 'px');
    thicknessValue.parent(thicknessSliderGroup.elt);
    thicknessValue.class('slider-value');

    thicknessSlider.input(() => {
      let val = thicknessSlider.value();
      thicknessValue.html(val.toFixed(1) + 'px');
      if (shapeType === 'cercle') epaisseurContourCercles = val;
      else if (shapeType === 'carre') epaisseurContourCarres = val;
      else if (shapeType === 'triangle') epaisseurContourTriangles = val;
      necesiteRedessiner = true;
    });

    // Restaurer la position du scroll avec requestAnimationFrame pour attendre le rendu du DOM
    requestAnimationFrame(() => {
      panneauControle.scrollTop = scrollPosition;
    });

    // TAILLE
    let sizeGroup = createDiv();
    sizeGroup.parent(container);
    sizeGroup.class('settings-group');
    let sizeLabel = createP('Taille');
    sizeLabel.parent(sizeGroup.elt);
    sizeLabel.style('margin', '0').style('font-size', '14px').style('font-weight', '500').style('color', '#374151');

    let sizeButtonGroup = createDiv();
    sizeButtonGroup.parent(sizeGroup.elt);
    sizeButtonGroup.class('button-group');

    let isUniform = (shapeType === 'cercle' && unifierCercles) ||
                    (shapeType === 'carre' && unifierCarres) ||
                    (shapeType === 'triangle' && unifierTriangles);

    let btnUniform = createButton('Uniforme');
    btnUniform.parent(sizeButtonGroup.elt);
    if (isUniform) btnUniform.elt.classList.add('active');
    btnUniform.mousePressed(() => {
      if (shapeType === 'cercle') unifierCercles = true;
      else if (shapeType === 'carre') unifierCarres = true;
      else if (shapeType === 'triangle') unifierTriangles = true;
      updateShapeSettings(shapeType);
      necesiteRedessiner = true;
    });

    let btnRandom = createButton('Variable');
    btnRandom.parent(sizeButtonGroup.elt);
    if (!isUniform) btnRandom.elt.classList.add('active');
    btnRandom.mousePressed(() => {
      if (shapeType === 'cercle') unifierCercles = false;
      else if (shapeType === 'carre') unifierCarres = false;
      else if (shapeType === 'triangle') unifierTriangles = false;
      updateShapeSettings(shapeType);
      necesiteRedessiner = true;
    });

    // Slider de taille
    let sizeSliderGroup = createDiv();
    sizeSliderGroup.parent(sizeGroup.elt);
    sizeSliderGroup.class('slider-group');

    let currentSize = shapeType === 'cercle' ? echelleCercles : (shapeType === 'carre' ? echelleCarres : echelleTriangles);
    let sizeSlider = createSlider(0.5, 3, currentSize, 0.1);
    sizeSlider.parent(sizeSliderGroup.elt);
    sizeSlider.class('slider');
    sizeSlider.style('flex', '1');

    let sizeValue = createDiv(currentSize.toFixed(1) + 'x');
    sizeValue.parent(sizeSliderGroup.elt);
    sizeValue.class('slider-value');

    sizeSlider.input(() => {
      let val = sizeSlider.value();
      sizeValue.html(val.toFixed(1) + 'x');
      if (shapeType === 'cercle') echelleCercles = val;
      else if (shapeType === 'carre') echelleCarres = val;
      else if (shapeType === 'triangle') echelleTriangles = val;
      necesiteRedessiner = true;
    });

    // TRANSPARENCE
    let alphaGroup = createDiv();
    alphaGroup.parent(container);
    alphaGroup.class('settings-group');
    let alphaLabel = createP('Transparence');
    alphaLabel.parent(alphaGroup.elt);
    alphaLabel.style('margin', '0').style('font-size', '14px').style('font-weight', '500').style('color', '#374151');

    let alphaSliderGroup = createDiv();
    alphaSliderGroup.parent(alphaGroup.elt);
    alphaSliderGroup.class('slider-group');

    let currentAlpha = shapeType === 'cercle' ? opaciteFormeCercles : (shapeType === 'carre' ? opaciteFormeCarres : opaciteFormeTriangles);
    let alphaSlider = createSlider(0, 1, 1 - currentAlpha, 0.01);
    alphaSlider.parent(alphaSliderGroup.elt);
    alphaSlider.class('slider');
    alphaSlider.style('flex', '1');

    let alphaValue = createDiv(floor((1 - currentAlpha) * 100) + '%');
    alphaValue.parent(alphaSliderGroup.elt);
    alphaValue.class('slider-value');

    alphaSlider.input(() => {
      let val = alphaSlider.value();
      alphaValue.html(floor(val * 100) + '%');
      if (shapeType === 'cercle') opaciteFormeCercles = 1 - val;
      else if (shapeType === 'carre') opaciteFormeCarres = 1 - val;
      else if (shapeType === 'triangle') opaciteFormeTriangles = 1 - val;
      necesiteRedessiner = true;
    });
  }

  // ===== SECTION 4 : COULEURS =====
  let sectionCouleurs = createDiv();
  sectionCouleurs.parent(panneauControle);
  sectionCouleurs.style('display', 'flex').style('flex-direction', 'column').style('gap', '12px');

  let labelCouleurs = createP('Couleurs');
  labelCouleurs.parent(sectionCouleurs);
  labelCouleurs.class('section-heading');
  labelCouleurs.style('margin', '0');

  if (!cyan) cyan = color('#0088aa');
  if (!magenta) magenta = color('#cc0088');
  if (!yellow) yellow = color('#ffcc00');
  if (!black) black = color('#333333');

  const couleursInit = [cyan, magenta, yellow, black];
  let colorsContainer = createDiv();
  colorsContainer.parent(sectionCouleurs);
  colorsContainer.class('colors-section');

  for (let i = 0; i < 4; i++) {
    let colorRow = createDiv();
    colorRow.parent(colorsContainer.elt);
    colorRow.class('color-row');

    let pickerWrapper = createDiv();
    pickerWrapper.parent(colorRow.elt);
    pickerWrapper.class('color-picker-wrapper');

    let hexVal = rgbToHex(couleursInit[i]);
    
    let picker = createInput(hexVal, 'color');
    picker.parent(pickerWrapper.elt);
    picker.input(() => {
      let v = picker.value();
      inp.value(v);
      setPaletteColor(i, v);
      updatePreview(i);
      necesiteRedessiner = true;
    });
    palettePickers.push(picker);

    let inp = createInput(hexVal);
    inp.parent(colorRow.elt);
    inp.attribute('type', 'text');
    inp.attribute('maxlength', '7');
    inp.class('color-hex');
    inp.input(() => {
      let v = normalizeHex(inp.value());
      if (v) {
        picker.value(v);
        setPaletteColor(i, v);
        updatePreview(i);
        necesiteRedessiner = true;
      }
    });
    paletteInputs.push(inp);
  }

  updateAllPreviews();

  // ===== SECTION BOUTONS =====
  let sectionBoutons = createDiv();
  sectionBoutons.parent(panneauControle);
  sectionBoutons.class('button-group-section');

    let btnDownload = createButton('');
  btnDownload.parent(sectionBoutons);
  btnDownload.class('btn-telecharger');
  btnDownload.elt.innerHTML = `<svg style="width: 14px; height: 14px; margin-right: 6px; opacity: 0.7; display: inline-block; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Télécharger PNG`;
  btnDownload.mousePressed(() => {
    telechargerPNG();
  });
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
  
  // Appliquer le fond blanc
  background(255, 255, 255);
  
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
  
  dessinerForme(X, Y - diff, CMYKspotsize[3] * 0.65, black, 'noir');
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
  exportGraphics.background(255, 255, 255);
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
  
  dessinerFormeExport(pg, X, Y - diff, CMYKspotsize[3] * 0.65, black, 'noir');
  dessinerFormeExport(pg, X - diff, Y, CMYKspotsize[0], cyan, 'cyan');
  dessinerFormeExport(pg, X, Y + diff, CMYKspotsize[1], magenta, 'magenta');
  dessinerFormeExport(pg, X + diff, Y, CMYKspotsize[2], yellow, 'jaune');
}

