var perso = document.querySelector(".perso");
var obstacles = document.querySelector(".obstacles");
var scoreElement = document.getElementById("score");
var bonus = document.querySelector(".bonus");
var cadreWidth = document.querySelector(".jeu").offsetWidth;
var limiteDroite = cadreWidth - perso.offsetWidth;
var nombreSaut = 0;
var positionPerso = 0;
var jeuEnCours = false; // Ajout de la variable pour suivre l'état du jeu

cacherBonus();

function cacherBonus() {
  bonus.classList.add('invisible');

  setTimeout(function() {
    var obstaclesRect = obstacles.getBoundingClientRect();
    var obstacleLeft = obstaclesRect.left;
    var obstacleWidth = obstaclesRect.width;
    var bonusLeft = obstacleLeft - bonus.offsetWidth - 120; // Décalage de 120 pixels avant l'obstacle

    bonus.style.left = bonusLeft + "px";
    bonus.classList.remove('invisible');
  }, 5000);
}

document.addEventListener("keydown", function(event) {
  if (event.keyCode === 38) {
    sauter();
  } else if (event.keyCode === 37) {
    deplacerPersonnage(-10);
  } else if (event.keyCode === 39) {
    deplacerPersonnage(10);
  }
});

function sauter() {
  if (perso.classList != "animation") {
    perso.classList.add('animation');
    nombreSaut++;

    if (nombreSaut == 5) {
      obstacles.style.animationDuration = "1.5s";
    }

    scoreElement.textContent = nombreSaut * 5;

    setTimeout(function() {
      perso.classList.remove('animation');
    }, 500);
  }
}

function reinitialiserJeu() {
  nombreSaut = 0;
  positionPerso = 0;
  scoreElement.textContent = nombreSaut;
  perso.style.left = positionPerso + "px";
  obstacles.style.animation = "none"; // Ajout pour réinitialiser l'animation de l'obstacle
  jeuEnCours = true;
}

var verification = setInterval(function() {
  var persoTop = parseInt(window.getComputedStyle(perso).getPropertyValue("top"));
  var obstaclesLeft = parseInt(window.getComputedStyle(obstacles).getPropertyValue("left"));

  if ((obstaclesLeft >= positionPerso && obstaclesLeft <= positionPerso + perso.offsetWidth) && persoTop >= 130) {
    jeuEnCours = false; // Ajout pour mettre le jeu en mode terminé
    obstacles.style.animation = "none";
    alert("Vous avez perdu");
    reinitialiserJeu();
  }
  
  // Vérification de la collision avec le bonus
  var bonusRect = bonus.getBoundingClientRect();
  var persoRect = perso.getBoundingClientRect();

  if (
    bonusRect.left <= persoRect.right && // Vérifier collision à droite du personnage
    bonusRect.right >= persoRect.left && // Vérifier collision à gauche du personnage
    bonusRect.top <= persoRect.bottom && // Vérifier collision en bas du personnage
    bonusRect.bottom >= persoRect.top // Vérifier collision en haut du personnage
  ) {
    jeuEnCours = false; // Mettre le jeu en mode terminé
    obstacles.style.animation = "none";
    //nouveau evenement qui va nous servir a envoyer le score dans le controller du page
    var evenement = new CustomEvent('update-score', {detail: scoreElement.textContent});
    //envoie l'evenement
    window.dispatchEvent(evenement);
    alert("Félicitation, Vous avez gagné !");
    reinitialiserJeu();
    clearInterval(verification); // Arrêter la vérification de collision
  }
}, 1);

function demarrerJeu() {
  if (!jeuEnCours) {
    jeuEnCours = true;
    reinitialiserJeu();
    cacherBonus(); // Ajout de l'appel à cacherBonus()
    obstacles.style.animation = "obst-anim 2.5s infinite";
    animationObstacle = obstacles.animate(
      [
        { left: "480px" },
        { left: "-40px" }
      ],
      {
        duration: 1500,
        iterations: Infinity
      }
    );
    animationObstacle.onfinish = function() {
      verifierCollision();
      if (jeuEnCours) {
        animationObstacle.play(); // Relancer l'animation si le jeu est en cours
        verifierCollision(); // Appeler la fonction pour vérifier les collisions en temps réel
      }
    };
  }
}

// Ajout du gestionnaire d'événement pour le bouton "Commencer"
var boutonCommencer = document.getElementById("commencer");
boutonCommencer.addEventListener("click", demarrerJeu);

function verifierCollision() {
  if (!jeuEnCours) return; // Empêche la vérification de collision lorsque le jeu est terminé

  var obstacleRect = obstacles.getBoundingClientRect();
  var persoRect = perso.getBoundingClientRect();

  if (
    obstacleRect.left <= persoRect.right && // Vérifier collision à droite du personnage
    obstacleRect.right >= persoRect.left && // Vérifier collision à gauche du personnage
    obstacleRect.top <= persoRect.bottom && // Vérifier collision en bas du personnage
    obstacleRect.bottom >= persoRect.top // Vérifier collision en haut du personnage
  ) {
    jeuEnCours = false; // Mettre le jeu en mode terminé
    obstacles.style.animation = "none";
    alert("Vous avez perdu");
    reinitialiserJeu();
    clearInterval(verification); // Arrêter la vérification de collision
  }
  
  // Vérification de la collision avec le bonus
  var bonusRect = bonus.getBoundingClientRect();

  if (
    bonusRect.left <= persoRect.right && // Vérifier collision à droite du personnage
    bonusRect.right >= persoRect.left && // Vérifier collision à gauche du personnage
    bonusRect.top <= persoRect.bottom && // Vérifier collision en bas du personnage
    bonusRect.bottom >= persoRect.top // Vérifier collision en haut du personnage
  ) {
    jeuEnCours = false; // Mettre le jeu en mode terminé
    obstacles.style.animation = "none";
    alert("Félicitation, Vous avez gagné !");
    reinitialiserJeu();
    clearInterval(verification); // Arrêter la vérification de collision
  }
}

function deplacerPersonnage(deplacement) {
  positionPerso += deplacement;

  if (positionPerso < 0) {
    positionPerso = 0;
  }

  if (positionPerso > limiteDroite) {
    positionPerso = limiteDroite;
  }

  perso.style.left = positionPerso + "px";

  if (deplacement < 0) {
    perso.classList.add("left");
  } else {
    perso.classList.remove("left");
  }
}
