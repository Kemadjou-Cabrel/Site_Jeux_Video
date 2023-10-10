// creation de l'environnement du jeu
const gameWorld = document.querySelector('#gameBoard'); // récupére la taille du monde sur la page web
const c = gameWorld.getContext('2d'); // on fait de la 2D
gameWorld.width = gameWorld.clientWidth;
gameWorld.height = gameWorld.clientHeight;

const scoreWorld = document.querySelector('#score'); // récupére la taille du monde sur la page web
const s = gameWorld.getContext('2d'); // on fait de la 2D
scoreWorld.width = gameWorld.clientWidth;
scoreWorld.height = gameWorld.clientHeight;

// Variables globales pour le jeu
var x = gameWorld.width/2; // position x de la balle
var y = gameWorld.height*0.98; // position y de la balle
var rayonBall = 12; // rayon de la balle
var vieCube = 1;
var nbrBalle = 1;
var tirEnCours = false;
var departX,departY,finX,finY,deltaX,deltaY,distance; // pour le tire de balle
var idIntervalTire;
var TabJeu;
var blocFull = 0; // pour définir la taile des cubes
var blocVide = 0; // pour définier la taille des cubes noir à l'intérieur des cubes
var finTire=0;
var colBonus=0;
var pseudo;

// Les différents fonctions pour créer et dessiner le jeu

// Crée le tableau de jeu
function CreerTabJeu()
{
    
    TabJeu = new Array(8);
    for(var i = 0; i < TabJeu.length;i++)
    {
        TabJeu[i] = new Array(TabJeu.length-1);
    }
    for(var i = 0;i < TabJeu.length;i++)
    {
        for(j = 0;j<TabJeu[i].length;j++)
        {
            TabJeu[i][j]= new Array(3);
        }
    }
    for(var i = 0;i<TabJeu.length;i++)
    {
        for(j = 0;j<TabJeu[i].length;j++)
        {
            for(var k = 0;k<TabJeu[i][j].length;k++)
            {
                TabJeu[i][j][k]=0;
            }
        }
    }
    blocFull = gameWorld.width/TabJeu[0].length;
    blocVide = gameWorld.width/TabJeu[0].length-10;
}

// Dessine la balle
function dessinerBall(x1,y1) 
{
    c.beginPath(); // permet de dessiner que la balle en blanc
    c.arc(x1, y1, rayonBall, 0, Math.PI*2);
    c.fillStyle = 'white'; // permet de mettre la couleur blanche
    c.fill(); // permet de mettre la couleur blanche
    c.closePath();  
}

// effacer la balle
function effacerBalle(x1,y1)
{
    c.save();
    c.globalCompositeOperation = 'destination-out';
    c.beginPath();
    c.arc(x1, y1, rayonBall+1, 0, 2 * Math.PI);
    c.fill();
    c.restore();
}

function dessinerLigneRouge()
{
    c.beginPath();
    c.fillStyle = '#f00000';
    c.fill();
    c.fillRect(0,gameWorld.height*0.9,gameWorld.width,2);
    c.closePath();
}

// Dessine les blocs
function dessinerBloc()
{
    var PosX = 0;
    var PosY = 0;
    var nbrLignesTab = 0; 
    //c.clearRect(0,0,gameWorld.width,gameWorld.height); // efface ce qui se trouve le gameworld
    

    while(nbrLignesTab < TabJeu.length)
    {
        c.beginPath();
        for(var i = 0, PosX = gameWorld.width/TabJeu[nbrLignesTab].length, PosY = (gameWorld.height*0.9-blocFull)/TabJeu.length; i < TabJeu[nbrLignesTab].length; i++)
        {
            if(TabJeu[nbrLignesTab][i][0] == 1)
            {
                switch(TabJeu[nbrLignesTab][i][2])
                {
                    case 0 :
                        c.fillStyle = '#7514cf';
                        c.fill();
                        break;
                    
                    case 1 :
                        c.fillStyle = '#51f5f5';
                        c.fill();
                        break;
                    case 2 :
                        c.fillStyle = '#fa1eeb';
                        c.fill();
                        break;
                        
                    default :
                        c.fillStyle = 'orange';
                        c.fill();
                        break;
                }
                positionVieX = PosX*i+blocVide/2;
                positionVieY = PosY*(nbrLignesTab+1)+blocFull/2;
                c.font = '20px sans-serif';
                c.fillRect(PosX*i, PosY*(nbrLignesTab+1), blocFull, blocFull); //Dessine un rectangle rempli.
                c.clearRect(PosX*i+5,PosY*(nbrLignesTab+1)+5,blocVide,blocVide); // Dessine un rectangle rempli.
                c.fillText(TabJeu[nbrLignesTab][i][1],positionVieX,positionVieY); // insere le nombre de vie du bloc
            }
            if(TabJeu[nbrLignesTab][i][0] == 2)
            {
                positionVieX = PosX*i+blocFull/2;
                positionVieY = PosY*(nbrLignesTab+1)+blocFull/2;
                c.font = '15px sans-serif';
                c.beginPath();
                c.arc(positionVieX, positionVieY, rayonBall, 0, Math.PI*2);
                c.fillStyle = 'yellow'; // permet de mettre la couleur blanche
                c.fill();
                c.closePath();
                c.beginPath();
                c.fillStyle = 'black';
                c.fill();
                c.fillText('+1',positionVieX-8,positionVieY+5);
                c.closePath();
            }
        }
        c.closePath();
        nbrLignesTab++;
    }
}

function effacerBloc()
{
    var PosX = 0;
    var PosY = 0;
    var nbrLignesTab = 0; 
    //c.clearRect(0,0,gameWorld.width,gameWorld.height); // efface ce qui se trouve le gameworld
    

    while(nbrLignesTab < TabJeu.length)
    {
        c.beginPath()
        for(var i = 0, PosX = gameWorld.width/TabJeu[nbrLignesTab].length, PosY = (gameWorld.height*0.9-blocFull)/TabJeu.length; i < TabJeu[nbrLignesTab].length; i++)
        {
            if(TabJeu[nbrLignesTab][i][0] == 1 || TabJeu[nbrLignesTab][i][0] == 2)
            {
                c.clearRect(PosX*i-2,PosY*(nbrLignesTab+1)-1,blocFull+5,blocFull+3);
            }
            
        }
        c.closePath();
        nbrLignesTab++;
    }
}

function Score()
{
    let score = "Score <br>" + vieCube;
    document.getElementById('score').innerHTML = score;
}

function NbrBalle()
{
    let balle = "x" + nbrBalle;
    document.getElementById('nbrBalle').innerHTML = balle; 
}

function PseudoUser()
{
    pseudo = sessionStorage.getItem('username');
    document.getElementById('connected').innerHTML = "Connecté en tant que "+pseudo;
}






