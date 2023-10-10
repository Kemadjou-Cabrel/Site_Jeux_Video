var config = {
    type: Phaser.AUTO,
    parent:'game-container',
    width: 640,
    height: 512,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
        
    }
}
var player ;

var boxebleu=[]
var lose=0;
var score=0;

var mouvement=0;

var cursors;

const GAME_WIDTH = 640;

const GAME_HEIGHT = 512;


var game = new Phaser.Game(config);




var level = 
[
  [0,   0,  99, 99, 99,  99,  99,  99,  99, 0],
  [99,  99,  99, 0, 0,  0,  0,  0,   99,   0],
  [99,  51,  52, 8, 0, 0, 0, 0,     99, 0],
  [99,  99,  99, 0, 8,  51, 0,  0,     99, 0],
  [99,  51,   0,  99, 8, 0, 0, 0,    99,     99],
  [99,  8,   0,  99, 51, 0,  0,  0,  0,    99],
  [99,  0,   0,   0, 8, 8,  51,  0,  0,    99],
  [99,  99, 99, 99, 51, 99,  99,  99,99,99]
];


//Une instance d'un objet Phaser.Game est affectee a une variable locale appelée gameet l'objet de configuration lui est transmis.


function preload ()
{
    this.load.image('nouveau', 'assets/nouveau.png')
    this.load.spritesheet('tiles', 'assets/sokoban_tilesheet.png',{ 
        frameWidth: 64, 
        startFrame: 0 }
        );
    this.cursors = this.input.keyboard.createCursorKeys();
}

function create() {

    
    this.add.image(400, 300, 'nouveau');
    var map = this.make.tilemap({ 
        data: level, 
        tileWidth: 64, 
        tileHeight: 64 
    });

    var tiles = map.addTilesetImage('tiles');

    var layer = map.createLayer(0, tiles, 0, 0);


   



    // deplacement 

    this.player = layer.createFromTiles(52, 0, {key:'tiles',frame:52}).pop();



    this.player.setOrigin(0);
    //Avoir les references des boites
    boxebleu = layer.createFromTiles(8, 0, {key:'tiles',frame:8})
    .map(box => box.setOrigin(0))

    /// permettre a mon joueur de marcher 
/// -------------------------------------------------------------------
    this.anims.create(
    {
        key:'idle-down',
        frames: [ { key: 'tiles', frame: 52 } ],

    })
    this.anims.create(
    {
        key:'idle-left',
        frames: [ { key: 'tiles', frame: 81 } ],

    });
    this.anims.create(
    {
        key:'idle-right',
        frames: [ { key: 'tiles', frame: 78 } ],
        
    });
    this.anims.create(
    {
        key:'idle-up',
        frames: [ { key: 'tiles', frame: 55 } ],
        
    });
    this.anims.create(
    {

    key:'left',
    frames: this.anims.generateFrameNumbers('tiles', { start: 81, end: 83 }),
    frameRate: 10,
    repeat: -1
    });

    this.anims.create(
    {

    key:'right',
    frames: this.anims.generateFrameNumbers('tiles', { start: 78, end: 80 }),
    frameRate: 10,
    repeat: -1
    });

    this.anims.create(
    {

    key:'up',
    frames: this.anims.generateFrameNumbers('tiles', { start: 55, end: 57 }),
    frameRate: 10,
    repeat: -1
    })

    this.anims.create(
    {

    key:'down',
    frames: this.anims.generateFrameNumbers('tiles', { start: 52, end: 54 }),
    frameRate: 10,
    repeat: -1
    })
//-------------------------------------------------------------------
    cursors = this.input.keyboard.createCursorKeys();
    movesText = this.add.text(450, 10, 'Déplacement: 0');
    scoretext = this.add.text(450, 25, 'score: 0');
    this.add.text(450, 40, 'Déplacement max=30');
 


    
    
}





function update ()
{


    if(this.tweens.isTweening(this.player))
    {
        return
    }

    if (!this.player || !this.cursors)
    {
        return;
    }
    var justleft = Phaser.Input.Keyboard.JustDown(cursors.left);
    var justright = Phaser.Input.Keyboard.JustDown(cursors.right);
    var justDown = Phaser.Input.Keyboard.JustDown(cursors.down);
    var justUp = Phaser.Input.Keyboard.JustDown(cursors.up);
    
    if (justleft && this.player.x > 0)
    {

        if (!blocage(this.player.x - 64, this.player.y)) 
        {

            var box = getBoxAt(this.player.x-32  , this.player.y );
            


            if (box) {
                var newBoxX = box.x - 64; 
                var newBoxY = box.y;
                var tileX = Math.floor(newBoxX / 64); 
                var tileY = Math.floor(newBoxY / 64);

                
                if (level[tileY][tileX] !== 99) {
                    if (level[tileY][tileX] === 51) 
                    {
                        console.log(verifierTuilesBoxBleues() );
                    }


                        if (checkCollisionWithOtherBox(newBoxX, newBoxY,box)) 
                        {
                            // Il y a une collision avec une autre boîte, la boîte en cours de déplacement ne peut pas se déplacer
                            return;
                        }
    
                    this.tweens.add({
                        targets: box,
                        x: '-=64',
                        duration: 500,
                    });

                }
                else
                {
                    
                    return;
                }
            }

            this.player.anims.play('left', true);
            this.tweens.add({
            targets: this.player,
            x:'-=64',
            duration: 500,
            onComplete:() =>
            {
                var key = this.player.anims.currentAnim.key;
                if(!key.startsWith('idle-'))
                {
                    this.player.anims.play(`idle-${key}`, true);
                }
                mouvement++;
                score=score+10;
                movesText.text = `Deplacement: ${mouvement}`;
                scoretext.text = `Score: ${score}`;
                
            }

            }) 
        }
    } 

    else if ((justright && this.player.x < GAME_WIDTH - 64))
    {
        if (!blocage(this.player.x + 96, this.player.y))
        {
            var box = getBoxAt(this.player.x + 32  , this.player.y);
            


            if (box) 
            {
                var newBoxX = box.x + 64; 
                var newBoxY = box.y;
                var tileX = Math.floor(newBoxX / 64);
                var tileY = Math.floor(newBoxY / 64);

                
                if (level[tileY][tileX] !== 99) 
                {
                    if (level[tileY][tileX] === 51) 
                    {
                        console.log(verifierTuilesBoxBleues());
                    }
                    if (checkCollisionWithOtherBox(newBoxX, newBoxY,box)) 
                    {
                        // Il y a une collision avec une autre boîte, la boîte en cours de déplacement ne peut pas se déplacer
                        return;
                    }

                    this.tweens.add({
                        targets: box,
                        x: '+=64',
                        duration: 500
                    });       
                }
                else
                {
                    return;
                }
            }
            this.player.anims.play('right', true);
            this.tweens.add({
            targets:this.player,
            x:'+=64',
            duration: 500,
            onComplete:() =>
            {
                var key = this.player.anims.currentAnim.key;
                if(!key.startsWith('idle-'))
                {
                    this.player.anims.play(`idle-${key}`, true);
                }
                mouvement++;
                score=score+10;
                movesText.text = `Deplacement: ${mouvement}`;
                scoretext.text = `Score: ${score}`;
            }

            })
        }
        
    }
    else if (justUp && this.player.y > 0)
    {
        if (!blocage(this.player.x, this.player.y - 32))
        {
            var box = getBoxAt(this.player.x   , this.player.y-32);
            

            if (box) {
                var newBoxX = box.x;
                var newBoxY = box.y - 64; 
                var tileX = Math.floor(newBoxX / 64); 
                var tileY = Math.floor(newBoxY / 64);

                
                if (level[tileY][tileX] !== 99) {
                    if (level[tileY][tileX] === 51) 
                    {
                        console.log(verifierTuilesBoxBleues() );
                    }
                        if (checkCollisionWithOtherBox(newBoxX, newBoxY,box)) 
                        {
                            // Il y a une collision avec une autre boîte, la boîte en cours de déplacement ne peut pas se déplacer
                            return;
                        }
                    this.tweens.add({
                        targets: box,
                        y: '-=64',
                        duration: 500
                    });
                }
                else
                {
                    return;
                }
            }


            this.player.anims.play('up', true);
            this.tweens.add({
            targets:this.player,
            y:'-=64',
            duration: 500,
            onComplete:() =>
            {
                var key = this.player.anims.currentAnim.key;
                if(!key.startsWith('idle-'))
                {
                    this.player.anims.play(`idle-${key}`, true);
                }
                mouvement++;
                score=score+10;
                movesText.text = `Deplacement: ${mouvement}`;
                scoretext.text = `Score: ${score}`;
            }

            })
        } 


        
    }
    else if (justDown && this.player.y < GAME_HEIGHT - 64)
    {
        if (!blocage(this.player.x, this.player.y + 96))
        {
            var box = getBoxAt(this.player.x   , this.player.y + 32);
           

            if (box) 
            {
                var newBoxX = box.x;
                var newBoxY = box.y + 64; 
                var tileX = Math.floor(newBoxX / 64); 
                var tileY = Math.floor(newBoxY / 64);

                
                if (level[tileY][tileX] !== 99) {
                    if (level[tileY][tileX] === 51) 
                    {
                        console.log(verifierTuilesBoxBleues() );
                    }
                        if (checkCollisionWithOtherBox(newBoxX, newBoxY,box)) 
                        {
                            return;
                        }
                    this.tweens.add({
                        targets: box,
                        y: '+=64',
                        duration: 500
                    });
                }
                else
                {
                    return;
                }
            }

            this.player.anims.play('down', true);
            this.tweens.add({
            targets:this.player,
            y:'+=64',
            duration: 500,
            onComplete:() =>
            {
                var key = this.player.anims.currentAnim.key;
                if(!key.startsWith('idle-'))
                {
                    this.player.anims.play(`idle-${key}`, true);
                }
                mouvement++;
                score=score+10;
                movesText.text = `Deplacement: ${mouvement}`;
                scoretext.text = `Score: ${score}`;

            }

            })  
        }  

    }

    let i=verifierTuilesBoxBleues()
         
      if (mouvement<=30 ) 
      {
        if(i===1)
        {
           Game.call(this, 'Bravo Level complet vous avez effectue',mouvement); 
        }
        
      }
      else if(mouvement>30)
      {
        lose=1;
        Game.call(this, 'You lose vous avez effectue plus de 30','');
      }


    
}





function getBoxAt(playerX, playerY) 
{
    for (let i = 0; i < boxebleu.length; i++) 
    {
        let box = boxebleu[i];

        if (Math.abs(box.x - playerX) <= 32 && Math.abs(box.y - playerY) <= 32) 
        {

            return box;

        }
    }


    return null;
}
//---------------------------Juste pour la collisions du player 
function blocage(x, y) 
{
    let tileX = Math.floor(x / 64); 

    let tileY = Math.floor(y / 64);

    return level[tileY][tileX] === 99;
}


function checkCollisionWithOtherBox(x, y,boxcourant) 
{
    for (let i = 0; i < boxebleu.length; i++) 
    {
        let otherBox = boxebleu[i];


        if (otherBox !== boxcourant && otherBox.x === x && otherBox.y === y)
        {
            return true; // Collision détectée
        }
    }
    return false; 
}

function verifierTuilesBoxBleues() 
{    
    let compteur = 0; // Variable pour compter le nombre de boîtes sur la tuile 51

    for (let i = 0; i < boxebleu.length; i++) 
    {
        let box = boxebleu[i];

        var tileX = Math.floor(box.x / 64);

        var tileY = Math.floor(box.y / 64);

        if (level[tileY][tileX] === 51) 
        {
            compteur++;
        }
    }
    if (compteur === boxebleu.length)
    {
        return 1; 
    } 
    else
    {
        return 2; 
    }


}

function Game(message, mouvement) 
{

  var cover = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000);
  cover.setOrigin(0, 0);
  cover.setAlpha(0.7);

  var gameOverText = this.add.text(game.config.width / 2, game.config.height / 2, message + ' ' + mouvement + ' déplacements!',
  {
    fontFamily: 'Righteous',
    fontSize: '19px',
    fill: '#00ff00', 
    stroke: '#000000', 
    strokeThickness: 4
  });
  gameOverText.setOrigin(0.5);
  if (lose === 1) 
  {
    // Création du  bouton Retry
    var restartButton = this.add.text(
      game.config.width / 2,
      game.config.height / 2 + 100,
      'Retry',
      {
        fontFamily: 'Arial',
        fontSize: '32px', 
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: {
        left: 15, 
        right: 15, 
        top: 8, 
        bottom: 20
        }

      }
    );
    restartButton.setOrigin(0.5);
    restartButton.setInteractive();
    restartButton.on('pointerdown', function () 
    {
      // Recharger la page pour recommencer le jeu
      location.reload();
    });
  }

  // Désactiver les mouvements du joueur
  this.input.keyboard.enabled = false;
 
}
