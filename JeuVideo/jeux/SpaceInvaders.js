//configuration du jeu
var config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

//initialiser le jeu
var game = new Phaser.Game(config);

//declaration des differents variables
var player;
var beams;
var curseur;
var aliens;
var explosion;
var enemyBullets;
var viePlus;
var laserPower;
var UltraLaser;

var score = 0;
var scoreText;
var lives = 3;
var livesText;
var niveau = 1;
var niveauText;
var CanShootGrosLaser = false;

//cette fonction est utiliser pour charger tout les differents elements/images qu'on va utiliser pour le jeu
function preload() {
    this.load.image('BG', './gameAssets/spaceInvaders/background.png');
    this.load.spritesheet('ship', './gameAssets/spaceInvaders/ship.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('beam', './gameAssets/spaceInvaders/Player_beam.png');
    this.load.image('alien', './gameAssets/spaceInvaders/alien.png');
    this.load.image('alien2', './gameAssets/spaceInvaders/alien2.png');
    this.load.image('alien3', './gameAssets/spaceInvaders/alien3.png');
    this.load.spritesheet('explosion', './gameAssets/spaceInvaders/Explosion.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('BulletEnemy', './gameAssets/spaceInvaders/Enemy_projectile.png', {frameWidth: 16, frameHeight: 16});
    this.load.image('vie', './gameAssets/spaceInvaders/heart.png');
    this.load.image('cake', './gameAssets/spaceInvaders/Cake.png');
    this.load.image('MegaLaser', './gameAssets/spaceInvaders/UltraLaser.png');
    this.load.image('gameOver', './gameAssets/spaceInvaders/GAME_OVER.png');
}

function create() {
    //ajouter fond de ecran
    this.add.image(400, 300, 'BG');

    // Create score and lives text (temporaire doit etre remplacer)
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    livesText = this.add.text(600, 16, 'Lives: 3', { fontSize: '32px', fill: '#fff' });
    niveauText = this.add.text(300, 16, 'Niveau: 1', { fontSize: '32px', fill: '#fff' });

    // le veseau
    player = this.physics.add.sprite(400, 550, 'ship');

    //pour mettre le taille
    player.setScale(4);

    player.body.collideWorldBounds = true;
    
    //ajouter les animation pour le veseau

    this.anims.create({
        key: 'left',
        frames: [ { key: 'ship', frame: 0 } ],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: [ { key: 'ship', frame: 2 } ],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: [ { key: 'ship', frame: 1 } ],
        frameRate: 20
    });

    // Creation du group pour les balles
    /* 
        pour rappel un group c'est un containaire qui rassemble les elements qui se ressemble, dans cette cas les beams, ils vont tous avoir
        les memes caracteristique et vont etre reproduit plusieurs fois donc on peut les mettre dans une groupe
    */
    //maxsize correspond au nombre maximum de beam que on peut avoir a un temps donner
    beams = this.physics.add.group({
        defaultKey: 'beam',
        maxSize: 20
    });

    //creation du groupe des enemies
    aliens = this.physics.add.group();

    //4 lignes et 10 enemies sur chaque ligne
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 10; j++) {
            let alien;
            if(j%2)
            {
                alien = aliens.create(70 + j * 70, 60 + i * 50, 'alien');
                alien.setScale(0.035); //taille
            }
            else 
            {
                if(j%3)
                {
                    alien = aliens.create(70 + j * 70, 60 + i * 50, 'alien3');
                    alien.setScale(0.020); //taille
                }
                else
                {
                    alien = aliens.create(70 + j * 70, 60 + i * 50, 'alien2');
                    alien.setScale(0.070); //taille
                }
            }
            
            alien.setCollideWorldBounds(true); //pour ne pas depasser le fenetre
            alien.setVelocityX(15); //deplacement horizontal
            alien.setVelocityY(0); //vertical
        }
    }

    this.time.addEvent({
            delay: 2000, //apres 2 seconds on a envie que cette evenement se reproduit
            loop: true, //pour continuer a boucler
            callback: () => {
                aliens.getChildren().forEach(alien => {
                    alien.setVelocityX(alien.body.velocity.x * -1); // on va faire le deplacement inverser de ce que on etait en train de faire
                    alien.setVelocityY(15); // commencer a faire le deplacement vertical a une vitesse de 15
                });
            }
        }
    );

    //cree le group pour les items qui peuvent tomber
    viePlus = this.physics.add.group();
    laserPower = this.physics.add.group();
    
    //cree le laser
    UltraLaser = this.add.sprite(player.x, player.y, 'MegaLaser');
    UltraLaser.setVisible(false);

    //creation du animation pour l'explosion
    this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', {
          start: 0,
          end: 5,
        }),
        frameRate: 30,
        repeat: 0,
    });

    //creation du collition entre le laser du veseau et l'alien
    this.physics.add.collider(beams, aliens, function (beam, alien) {

        explosion = this.add.sprite(alien.x, alien.y, 'explosion'); //mettre le variable explosion au position du alien qui vient de mourir
        explosion.setScale(4); // agrandir la taille d'explosion
        explosion.play('explode'); // jouer l'animation que on avait cree

        // decide si l'ennemie doit faire tomber quelque chose
        if (Phaser.Math.Between(0, 10) === 1) {
            // creer l'objet a la position du l'enemie
            if (Phaser.Math.Between(0, 10) === 5)
            {
                const superLaser = laserPower.create(alien.x, alien.y, 'cake');
                superLaser.setScale(0.1);

                superLaser.setVelocityY(100);
            }
            else
            {
                const vie = viePlus.create(alien.x, alien.y, 'vie');
                vie.setScale(0.015);

                vie.setVelocityY(100);
            }
        }
    
        // tuer le beam et le alien 
        beam.disableBody(true, true);
        alien.disableBody(true, true);
    
        // ajouter 10 a la score
        score += 10;
        scoreText.setText('Score: ' + score);

    }, null, this);

    //creation des balles pour l'enemy
    enemyBullets = this.physics.add.group({
        defaultKey: 'BulletEnemy'
    });

    //apres chaque 2 secondes on envie de declencher le fonction enemyFireBullet pour que les aliens peuvent tirer des balles
    this.time.addEvent({
        delay: 2000, //nbr de minutes
        loop: true, //on a envie que ca boucle
        callback: enemyFireBullet, //nom du fonction
        callbackScope: this //faire le callback a partir d'ici
    });
    
    //si il y'a colision entre le joueur et le balle du alien
    this.physics.add.collider(player, enemyBullets, function (player, bullet) {
        bullet.disableBody(true, true); //supprime le balle
        lives -= 1; //diminue vie
        livesText.setText('Lives: ' + lives); //change le text

        if (lives === 0) {
            // effacer du ecran tout les aliens qui existe
            aliens.getChildren().forEach(alien => {
                alien.disableBody(true, true);
            });
        }
    }, null, this);

    // collision etre joueur et le item vie
    this.physics.add.collider(player, viePlus, (player, vie) => {
        // mise a jour du vie
        if(lives < 3)
        {
            lives += 1;
            livesText.setText('Lives: ' + lives); //change le text
        }

        // detruit le item
        vie.destroy();
    });


    //collision entre joueur et le cake item
    this.physics.add.collider(player, laserPower, (player, cake) => {
        MegaLaser.call(this);

        // detruit le item
        cake.destroy();
    });

    //creation du collition entre ultraLaser et l'alien
    this.physics.add.overlap(UltraLaser, aliens, function (laser, alien) {
        explosion = this.add.sprite(alien.x, alien.y, 'explosion'); //mettre le variable explosion au position du alien qui vient de mourir
        explosion.setScale(4); // agrandir la taille d'explosion
        explosion.play('explode'); // jouer l'animation que on avait cree
    
        // tuer le alien 
        alien.disableBody(true, true);
    
        // ajouter 10 a la score
        score += 10;
        scoreText.setText('Score: ' + score);

    }, null, this);

    //si il y'a colision entre le ultra laser et les balle du alien
    this.physics.add.overlap(UltraLaser, enemyBullets, function (laser, bullet) {
        bullet.disableBody(true, true); //supprime le balle
    }, null, this);

    curseur = this.input.keyboard.createCursorKeys(); //mettre les signaux du clavier pour les touche de deplacement dans curseur
    this.input.keyboard.on('keydown_SPACE', fireBullet, this); //appeler le fonction fireBullet quand on appuie sur espace
}

function update() {

    if (curseur.left.isDown) //si on appuie sur le touche fleche gauche
    {
        player.setVelocityX(-240); //vitess a laquelle il va faire le deplacement vers la gauche

        player.anims.play('left', true); //changement de animation
    }
    else if (curseur.right.isDown)
    {
        player.setVelocityX(240); //vers le droite

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0); //si pas de deplacement gauche ou droite on va arreter le veseau

        player.anims.play('idle');
    }

    // faire bouger les lazere vers le haut si il exist
    beams.getChildren().forEach(beam => {
        beam.setVelocityY(-400);
        if (beam.y < -50) {
          beam.disableBody(true, true);
        }
    });

    //si tout les aliens sont mort et que on plus de 0 vies
    if (aliens.countActive(true) === 0 && lives > 0) {
        //nouveau evement pour faire reapparaitre les enemies
        this.time.addEvent({
            callback: function() {
                //augment niveau
                niveau++;

                niveauText.setText('Niveau: ' + niveau);

                //refaire les enemies
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 10; j++) {
                        let alien;

                        if(j%2)
                        {
                            alien = aliens.create(70 + j * 70, 60 + i * 50, 'alien');
                            alien.setScale(0.035); //taille
                        }
                        else 
                        {
                            if(j%3)
                            {
                                alien = aliens.create(70 + j * 70, 60 + i * 50, 'alien3');
                                alien.setScale(0.020); //taille
                            }
                            else
                            {
                                alien = aliens.create(70 + j * 70, 60 + i * 50, 'alien2');
                                alien.setScale(0.070); //taille
                            }
                        }
                        
                        alien.setCollideWorldBounds(true);
                        alien.setVelocityX(15);
                        alien.setVelocityY(0);
                    }
                }

                //ajouter un nouveau evenement pour tirer donc le nombre de enemies qui tire augmente et il vont tirer plus vite
                this.time.addEvent({
                    delay: 2000 - (niveau*10), //nbr de minutes
                    loop: true, //on a envie que ca boucle
                    callback: enemyFireBullet, //nom du fonction
                    callbackScope: this //faire le callback a partir d'ici
                });
            },
            callbackScope: this
        });
    }

    //si nbr de vie est egal a 0 alors on va rentrer dans le fonction gameover
    if (lives === 0) {
        // Call gameOver function
        gameOver.call(this);
        lives -= 1;
    }

    //pour garder le ultra laser au meme position que le joueur
    if (UltraLaser) {
        UltraLaser.x = player.x;
        UltraLaser.y = player.y - 385;
    }
    
    viePlus.getChildren().forEach(vie => {
        if (vie.y > 600) {
          // tuer l'objet vie
          vie.destroy();
        }
    });

    //meme idee sauf si les enemies atteint a se deplacer jusqu'a 500 pixel vertical, dans cette cas c'est un gameover automatique
    aliens.getChildren().forEach(alien => {
        if (alien.y >= 500) {
            gameOver.call(this);
        }
    });
}

//fonction qui est lancer quand on appuie sur espace
function fireBullet() {
    let beam = beams.get(player.x, player.y - 30); //creer un laser a la position du joeur

    beam.setScale(2); //augmente taille

    //si laser existe alors on va faire un enable sur son corps pour que il existe phsyqiuement et le placer 30px avant le joeur(regarde update pour le suite)
    if (beam) {
      beam.enableBody(true, player.x, player.y - 30, true, true);
    }
}

//fonction utiliser par les enemies pour tirer
function enemyFireBullet() {
    const visibleAliens = aliens.getChildren().filter(alien => alien.visible); //trouve les aliens qui ne sont pas mort
    const randomAlien = Phaser.Utils.Array.GetRandom(visibleAliens); //trouve un alien aleotoirement de la liste des aliens existant

    if(randomAlien)
    {
        const enemyBullet = enemyBullets.get(randomAlien.x, randomAlien.y + 30); //creer un balle a la position du alien

        if (enemyBullet) {
            enemyBullet.setScale(2); //taille
            enemyBullet.enableBody(true, randomAlien.x, randomAlien.y + 30, true, true);//object existe physiquement
            this.physics.moveToObject(enemyBullet, player, 200); //aller vers le joeur
        }
    }
}

function gameOver() {
    this.physics.pause(); //un pause sur le jeu
    player.setTint(0xff0000); //change le couleur de joueur a rouge pour indiquer que il est mort
    
    // afficher un text gameover, dans notre cas un image gameover car c'est plus beau
    gameOverText = this.add.image(400, 250, 'gameOver');

    //nouveau evenement qui va nous servir a envoyer le score dans le controller du page
    var evenement = new CustomEvent('update-score', {detail: score});

    //envoie l'evenement
    window.dispatchEvent(evenement);

    gameOverText.setScale(8); //taille

    // affiche le score finale obtenu
    const finalScoreText = this.add.text(400, 350, `Score: ${score}`, {
        fontSize: '32px',
        fill: '#fff',
        align: 'center'
    });

    finalScoreText.setOrigin(0.5);//ajouter un point d'origine

    gameOverText.setInteractive(); //ajouter la possibiliter de interagir avec le image gameover

    //si on clique sur le gameover on peut recommencer
    gameOverText.on('pointerdown', () => {
        this.scene.restart(); //reinitiliser le jeu

        //mettre les valeurs initiale
        score = 0;
        lives = 3;
        niveau = 1;

        //mis a jour du affichage
        scoreText.setText('Score: ' + score);
        livesText.setText('Lives: ' + lives);
        niveauText.setText('Niveau: ' + niveau);
        player.clearTint();

        //resumer le jeu
        this.physics.resume();
    });
}

function MegaLaser()
{
    UltraLaser.setVisible(true);
    this.physics.world.enable(UltraLaser);

    this.time.delayedCall(2000, () => {
        UltraLaser.setVisible(false);
        this.physics.world.disable(UltraLaser);
        UltraLaser.body.enable = false;
    });
}
