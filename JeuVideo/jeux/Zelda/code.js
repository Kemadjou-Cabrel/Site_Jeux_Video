const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 500,
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
        update: update,
    },
};

var cursors;
let faune;
var lezard;
var player;
var spirou = [];
var laser;
var projectile;
var spirouProjectiles;
var wallsLayer;
var gameOverText;
var score = 0;
var scoreText;
let spirous = [];
var icon;
var game = new Phaser.Game(config);

function preload() {
    this.load.image('back', './jeux/Zelda/ressources/back.png');
    this.load.image('tiles', './jeux/Zelda/tiles/dungeon_tiles_extruded.png');
    this.load.image('laser', './jeux/Zelda/ressources/bullet.png');
    this.load.image('projectile', './jeux/Zelda/ressources/projectile.png');
    this.load.image('icon', './jeux/Zelda/ressources/explosion5.png');
    this.load.spritesheet('spirou', './jeux/Zelda/personnages/spirou.png', { frameWidth: 16, frameHeight: 16 });
    this.load.atlas('faune', './jeux/Zelda/personnages/fauna.png', './jeux/Zelda/personnages/fauna.json')
    this.load.tilemapTiledJSON('dungeon', './jeux/Zelda/tiles/dungeon01.json');
}

function gameOver(scene)
{
    scene.physics.pause(); 
    
    gameOverText = scene.add.text(400, 300, 'GameOver', {
        fontSize: '64px',
        fill: '#ff0000'
    });
    
    var evenement = new CustomEvent('update-score', {detail: score});

    window.dispatchEvent(evenement);

    gameOverText.setInteractive(); 
    
    gameOverText.on('pointerdown', () => {
        scene.scene.restart();

        faune.x = 128;
        faune.y = 120;
    
        spirou.x = 250;
        spirou.y = 330;


        scene.physics.resume();
    });
    score = 0;
}
function initMap()
{
    const map = this.make.tilemap({ key: 'dungeon' });
    const tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2);
    map.createStaticLayer('Ground', tileset);
    wallsLayer = map.createStaticLayer('Walls', tileset);
    wallsLayer.setCollisionByProperty({ collides: true });
}

function destroy(spirou)
{
    spirou.destroy();
    score += 1;
    scoreText.setText('Score: ' + score);
    console.log('Score:' + score);
}

function destroyFaune(faune)
{
    faune.destroy();
    gameOver(this);
    this.physics.add.existing(faune);
    this.physics.add.collider(faune, wallsLayer);
}
function create()
{
    this.add.image(400, 300, 'back');
    scoreText = this.add.text(400, 300, 'score', {
        fontSize: '64px',
        fill: '#0000ff'
    });

    initMap.bind(this)();

    for (let index = 0; index < 15; index++) {
        spirou[index] = this.physics.add.image(250, 330, 'spirou');
        spirou[index].setScale(1.4);
        spirou[index].setCollideWorldBounds(true);
        spirou[index].setVelocityX(Phaser.Math.Between(-50, 50));
        spirou[index].setVelocityY(Phaser.Math.Between(-50, 50));
    }
    faune = this.physics.add.sprite(128, 120, 'faune');

    icon = this.physics.add.sprite(game.config.width - 150, 100, 'icon');
    icon.setOrigin(0.5);
    
    laser = this.physics.add.group();
    spirouProjectiles = this.physics.add.group();
    cursors = this.input.keyboard.createCursorKeys()

    this.physics.add.existing(faune);
   
    this.physics.add.collider(faune, wallsLayer);
    this.physics.add.collider(spirou, wallsLayer);
    this.physics.add.collider(faune, icon, collectPowerUp, null, this);


    this.time.addEvent({
        delay: 3100,
        loop: true,
        callback: function() {
            for (let i = 0; i < spirou.length; i++) {
                const currentSpirou = spirou[i];
                if (currentSpirou.active && faune.active) {
                    const distanceX = faune.x - currentSpirou.x;
                    const distanceY = faune.y - currentSpirou.y;
                    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                    if (distance < 200) { 
                         const projectile = spirouProjectiles.create(currentSpirou.x, currentSpirou.y, 'projectile');
                        const velocityX = (distanceX / distance) * 500;
                        const velocityY = (distanceY / distance) * 500;
                        projectile.setVelocityX(velocityX);
                        projectile.setVelocityY(velocityY);
                    }
                }
            }
        },
        callbackScope: this
    });
    

    this.physics.add.overlap(laser, spirou, function(laser, spirou){
        destroy(spirou);
        laser.destroy();
    });

    this.physics.add.collider(faune, spirouProjectiles, destroyFaune, null, this);

}
function update(){
    const speed = 115;
    const vitesseSpirou = 25;

    if (spirou && spirou.body)
    {
        const distanceX = faune.x - spirou.x;
        const distanceY = faune.y - spirou.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const velocityX = (distanceX / distance) * vitesseSpirou;
        const velocityY = (distanceY / distance) * vitesseSpirou;
        spirou.body.setVelocityX(velocityX);
        spirou.body.setVelocityY(velocityY);
        spirou.body.velocity.normalize().scale(vitesseSpirou);
    }

    faune.body.setVelocity(0);

    const allEnemiesDestroyed = spirou.every(enemy => !enemy.active);

    if (allEnemiesDestroyed) {

        var evenement = new CustomEvent('update-score', {detail: score});
        window.dispatchEvent(evenement);
        
    }
    if (cursors.left.isDown) {
        faune.body.setVelocityX(-speed);
        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
          var projectile = laser.create(faune.x, faune.y, 'laser');
          projectile.setVelocity(-300, 0);
        }
      } else if (cursors.right.isDown) {
        faune.body.setVelocityX(speed);
        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
          var projectile = laser.create(faune.x, faune.y, 'laser');
          projectile.setVelocity(300, -0);
        }
      }
      
      if (cursors.up.isDown) {
        faune.body.setVelocityY(-speed);
        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
          var projectile = laser.create(faune.x, faune.y, 'laser');
          projectile.setVelocity(0, -300);
        }
      } else if (cursors.down.isDown) {
        faune.body.setVelocityY(speed);
        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
          var projectile = laser.create(faune.x, faune.y, 'laser');
          projectile.setVelocity(0, 300);
        }
      }
      
    faune.body.velocity.normalize().scale(speed);
}
function collectPowerUp(faune, icon) {
    for (let i = 0; i < spirou.length; i++) {
        const currentSpirou = spirou[i];
        destroy(currentSpirou);
    }

    icon.destroy();
}
