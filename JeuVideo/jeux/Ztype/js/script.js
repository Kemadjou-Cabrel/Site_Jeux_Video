import mots from './mots.json' assert {type: 'json'};

var config = {
    type: Phaser.AUTO,
    parent: "game-container",
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var viesRestantes = 3;
var game = new Phaser.Game(config);
let ship;
let text;
var scoreMultiplier = 1;
var score = 0;
let cursors;
let lettersPicked = [];
let targeted = false;
let wave = 1;
var enemies = [];
var texts = [];
var enemyDelay = 2000;
var target;
var targetedFirstLetter;
var targetIndex;
var self;
var viesRestantesText;
var interval;
var nbEnemies = 3 + wave * 2;
var yVelMinDifficulte = 20;
var yVelMaxDifficulte = 30;
var difficulte = 200;
var waveText;
var scoreText;
var bonus = 0;
var particles;
var particlesVisible = 1;
var lasers = [];

function  convertintChar(integer) {
    let character = 'a'.charCodeAt(0);
    return String.fromCharCode(character + integer);
}

function pickLetter() {
    let min;
    let max;
    let num;
    min = 0;
    max = 25;
    num = Math.floor(Math.random() * (max - min + 1) + min);

    return convertintChar(num);
}

function pickWord() {
    let letter;
    let picked;
    do
    {
        picked = false;
        letter = pickLetter();
        lettersPicked.forEach(l =>{
            if(letter == l)
                picked = true;
        });
    }while(picked == true);
    if(lettersPicked.length < 26)
        lettersPicked.push(letter);
    let word = mots[letter][Math.floor(Math.random() * mots[letter].length)];
    
    return word;
}



function preload() {
    this.load.setBaseURL('jeux/Ztype/images');

    this.load.image('ship', 'ship.png');
    this.load.image('spaceBaddie', 'space-baddie.png');
    this.load.image('omegaLaser', 'laser.png');
    this.load.image('background', 'background.jpg');
    this.load.image('shockwave', 'shockwave.png');
}

function wesh() {
    let i;

    for(i = 0; enemies.length > 0 && i < enemies.length; i++)
    {
        let t = texts[i];
        let e = enemies[i];
        t.x = e.x - (t.text.length * 4);
        t.y = e.y + 10;
    }
}

function create() {
    var background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.setAlpha(0.3);
    scoreText = this.add.text(game.config.width, game.config.height, 'Score : ' + score, { fontFamily: 'Arial', fontSize: '25px', color: '#00ff00', fontStyle: 'bold' }).setOrigin(1, 1);
    var scoreMultiplierText = this.add.text(game.config.width, game.config.height - scoreText.height - 5, "Multiplier : " + scoreMultiplier + "x", {fontFamily: 'Arial', fontSize: '15px', color: '#00ff00', fontStyle: 'bold'}).setOrigin(1, 1);
    viesRestantesText = this.add.text(0, game.config.height, 'Vies restantes : ' + viesRestantes, {fontFamily: 'Arial', fontSize: '25px', color: '#00ff00', fontStyle: 'bold'}).setOrigin(0, 1);
    waveText = this.add.text(0, game.config.height - viesRestantesText.height - 5, 'Vague : ' + wave, {fontFamily: 'Arial', fontSize: '15px', color: '#00ff00', fontStyle: 'bold'}).setOrigin(0, 1);
    self = this;

    ship = this.physics.add.image(400, 550, 'ship');

    particles = this.add.particles('shockwave');

    particles.createEmitter({
        speed: 50,
        scale: { start: 0.3, end: 0 }, 
        blendMode: 'ADD', 
        lifespan: 100, 
        frequency: 300, 
        maxParticles: 100, 
        x: ship.x,
        y: ship.y,
      });

      toggleParticles();

    this.lasers = this.physics.add.group(
        {

        });
    
    this.spaceBaddies = this.physics.add.group(
        {
            
        });

    this.physics.add.overlap(this.lasers, this.spaceBaddies, handleLaserCollision, null, this);    
    let i = 1; 
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xff0000); 
    graphics.beginPath();
    graphics.moveTo(0,487); 
    graphics.lineTo(800, 487); 
    graphics.closePath();
    graphics.strokePath();

  interval = setInterval(spawnEnemy, enemyDelay);

  cursors = this.input.keyboard.createCursorKeys();

  window.addEventListener('keydown', (e) =>
  {
        if(e.key == "Enter")
        {
            if(bonus)
                createExplosion();
        }
        else
        {
            if(e.key == "Backspace")
            {
                target.setColor("#ffffff");
                targeted = false;
            }
            if(targeted)
            {
                if(e.key == target.text.charAt(0))
                {
                    target.text = target.text.slice(1, target.text.length);
                    score += 3 * scoreMultiplier;
                    scoreText.text = "Score : " + score;
                    createLaser(ship.x, ship.y, target.x, target.y);
                }
                else if(e.key.charCodeAt(0) >= 97 && e.key.charCodeAt(0) <= 122)
                {
                    scoreMultiplier = 1;
                    scoreMultiplierText.text = "Multiplier : " + scoreMultiplier + "x";
                }
            }
            else
            {
                texts.forEach(elem => {
                    if(e.key == elem.text.charAt(0))
                    {
                        target = elem;
                        target.setColor("#DD6F03");
                        targetedFirstLetter = elem.text.charAt(0);
                        targetIndex = texts.indexOf(target);
                        targeted = true;
                        target.text = elem.text.slice(1, elem.text.length);
                        score += 10 * scoreMultiplier;
                        scoreText.text = "Score : " + score;
                        createLaser(ship.x, ship.y, target.x, target.y);
                    }
                });
                if(!targeted && e.key.charCodeAt(0) >= 97 && e.key.charCodeAt(0) <= 122)
                {
                    scoreMultiplier = 1;
                    scoreMultiplierText.text = "Multiplier : " + scoreMultiplier + "x";
                }
            }
            if(targeted && target.text.length == 0)
            {
                scoreMultiplier++;
                if(scoreMultiplier > 0 && scoreMultiplier % 10 == 0)
                {
                    toggleParticles();
                    bonus = 1;
                }
                scoreMultiplierText.text = "Multiplier : " + scoreMultiplier + "x";
                target.destroy();
                enemies[targetIndex].destroy();
                enemies.splice(targetIndex, 1);
                texts.splice(targetIndex, 1);
                lettersPicked.splice(lettersPicked.indexOf(targetedFirstLetter), 1);
                targeted = false;
                lasers.forEach(function(laser)
                {
                    laser.destroy();
                })
                lasers = [];
                if(nbEnemies == 0 && enemies.length == 0)
                {
                    augmenteDifficulte();
                }
            }
        }
  });
        
}

function update()
{
    wesh();

    this.lasers.getChildren().forEach((laser) => {
        if (laser.y < 0 || laser.y > 600) {
          laser.destroy();
        }
      });

    checkEnemies();
}

function createWord(length)
{
  let min = 97;
  let max = 122;
  let str = "";
  let i = 0;
  while(i < length)
  {
      str += String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));
      i++;
  }
  return str;
}

function createLaser(x, y, targetX, targetY)
{
    const laser = self.lasers.create(x, y, 'omegaLaser');
    lasers.push(laser);
    const angle = Phaser.Math.Angle.Between(x, y, targetX + 10, targetY);
    const laserSpeed = 1200;
    self.physics.velocityFromRotation(angle, laserSpeed, laser.body.velocity);
}

function handleLaserCollision(laser, enemy)
{
    laser.destroy();
}

function checkEnemies()
{
    self.spaceBaddies.getChildren().forEach((en) => {
        if(en.y > 487)
        {
            let index;
            enemies.forEach(e => {
                if(e == en)
                {
                    index = enemies.indexOf(e);
                    texts[index].destroy();
                    texts.splice(index, 1);
                    lettersPicked.splice(index, 1);
                }
            }); 
            en.destroy();
            enemies.splice(index, 1);
            viesRestantes--;
            viesRestantesText.text = 'Vies restantes : ' + viesRestantes;
            targeted = false;
            if(viesRestantes <= 0)
            {
                let gameOverText = self.add.text(400, 300, "Game Over !", {fontFamily: 'Georgia, "Goudy Bookletter 1911, Times, serif'});
                gameOverText.setFontSize('100px');
                gameOverText.setColor('red');
                gameOverText.setOrigin(0.5);
                
                var evenement = new CustomEvent('update-score', {detail: score});
                //envoie l'evenement
                window.dispatchEvent(evenement);
                game.destroy();
            }
            if(nbEnemies == 0 && enemies.length == 0)
                augmenteDifficulte();
        }
    })
}

function createExplosion() {
    
    var explosion = self.add.sprite(ship.x, ship.y, 'shockwave');
    explosion.setScale(0); 
  
    
  
    
    var explosionDuration = 500; 
    var maxExplosionScale = 4; 
  
    
    self.tweens.add({
      targets: explosion,
      scaleX: maxExplosionScale,
      scaleY: maxExplosionScale,
      duration: explosionDuration,
      ease: 'Linear',
      onComplete: function() {
        
        enemies.forEach(function(enemy) 
        {
            enemy.destroy();
            score += 3 * scoreMultiplier;
        });
        enemies = [];
        scoreText.text = "Score : " + score;
        texts.forEach(function(txt)
        {
            txt.destroy();
        });
        texts = [];
        lettersPicked = [];
        if(nbEnemies == 0)
            augmenteDifficulte();
        targeted = false;
        explosion.destroy();
      }
    });
    toggleParticles();
  }

  function spawnEnemy()
  {
    if(lettersPicked.length < 26)
        {
            if(nbEnemies > 0)
            {
                let sp = self.spaceBaddies.create(Phaser.Math.Between(50, 700), Phaser.Math.Between(10, 50), 'spaceBaddie');
                let text = self.add.text(0, 0, pickWord(), {fontFamily: 'Georgia, "Goudy Bookletter 1911, Times, serif'});
                enemies.push(sp);
                texts.push(text);
                let xVel = Phaser.Math.Between(1, 10);
                let yVel = Phaser.Math.Between(yVelMinDifficulte, yVelMaxDifficulte);
                if(sp.x > 400)
                xVel = - xVel;
                sp.setVelocity(xVel, yVel);
                text.x = 200;
                text.y = 400;
                
                nbEnemies--;
                console.log("nbEnemies : " + nbEnemies);
                if(nbEnemies == 0)
                {
                    clearInterval(interval);
                    console.log("Je clear la wave !");
                }
            }
        }

  }

  function augmenteDifficulte()
  {
    if(interval)
        clearInterval(interval);
    wave++;
    waveText.text = 'Vague : ' + wave;
    nbEnemies = 3 + wave * 2;
    if(enemyDelay - difficulte <= 600)
    {   
        enemyDelay = 600;
        yVelMinDifficulte += 5;
        yVelMaxDifficulte += 5;
    }
    else
    {
        enemyDelay -= 200;
    }
    interval = setInterval(spawnEnemy, enemyDelay)
    console.log("enemyDelay : " + enemyDelay);
  }

  function toggleParticles() {
    particlesVisible = !particlesVisible;
  
    particles.setVisible(particlesVisible);
  }