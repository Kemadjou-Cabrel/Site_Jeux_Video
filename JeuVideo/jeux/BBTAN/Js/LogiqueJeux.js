// Fonctions pour la logique du jeu

// MAJ du tableau de jeu
function BlocMAJ()
{
    var minBloc = 0;
    var randomCouleur;
    var randomPosition;
    var nbrLignesTab = TabJeu.length-1;// conditionn >= 0
    var difficulte = 4;
    while(nbrLignesTab >= 0)
    {
        if(nbrLignesTab == 0)
        {
            BonusMAJ();
            for(var i = 0; i < TabJeu[0].length; i++)
            {
                randomCouleur = Math.floor((Math.random()*4));
                if(vieCube%20 == 0 && difficulte >2)
                {
                    difficulte--;
                }
                randomPosition = Math.floor((Math.random()*difficulte));
                
                if(randomPosition == 1 && TabJeu[0][i][0] == 0)
                {
                    TabJeu[0][i][0] = 1;
                    TabJeu[0][i][1] = vieCube;
                    
                    switch(randomCouleur)
                    {
                        case 0 :
                            TabJeu[0][i][2] = 0;
                            break;
                        case 1 :
                            TabJeu[0][i][2] = 1;
                            break;
                        case 2 :
                            TabJeu[0][i][2] = 2;
                            break;
                            
                        default :
                            TabJeu[0][i][2] = 3;
                            break;
                    }
                    minBloc = 1;           
                }
                if( i == 6 && minBloc == 0) // permet de créer au moins un bloc
                {
                    i=0;
                }
        
            }
        }
        if(nbrLignesTab > 0)
        {
            for(var i = 0;i < TabJeu[nbrLignesTab].length;i++)
            {
                for(var j = 0; j < TabJeu[nbrLignesTab][i].length;j++)
                {
                    TabJeu[nbrLignesTab][i][j] = TabJeu[nbrLignesTab-1][i][j];
                    TabJeu[nbrLignesTab-1][i][j] = 0; // remet à zéro car copié 
                }
            }
        }
        nbrLignesTab--;
    }
}

// MAJ BONUS
function BonusMAJ()
{
    var randomPosition;
    randomPosition = Math.floor((Math.random()*(TabJeu.length-1)));
    TabJeu[0][randomPosition][0] = 2;   
}

// tire la balle
function TirerBall(dx1,dy1,x1,y1)
{
    var idInt;
    
    idInt = setInterval(function(){
        var PosX = 0;
        var PosY = 0;
        
        
        effacerBalle(x1,y1);
        effacerBloc();
        dessinerLigneRouge();
        for(var i = 0, PosX = gameWorld.width/TabJeu[0].length,  PosY = (gameWorld.height*0.9-blocFull)/TabJeu.length; i < TabJeu.length;i++)
        {
            for(var j = 0; j < TabJeu[i].length;j++)
            {
                if( x1+rayonBall >= PosX*j && x1-rayonBall <= PosX*j+blocFull && y1+rayonBall >= PosY*(i+1) && y1-rayonBall <= PosY*(i+1)+blocFull && TabJeu[i][j][0] == 1) // permet de voir s'il y collision avec un cube
                {
                    var cubeCenterX = PosX*j + blocVide/2;
                    var cubeCenterY = PosY*(i+1)+blocFull/2;
                    
                    var diffX = x1 - cubeCenterX; 
                    var diffY = y1 - cubeCenterY;
                    if(Math.abs(diffX)>Math.abs(diffY))
                    {
                        dx1 = -dx1;
                    }
                    else
                    {
                        dy1 = -dy1;
                    }
                    TabJeu[i][j][1]--;
                    if(TabJeu[i][j][1] == 0)
                    {
                        TabJeu[i][j][0]=0;
                    }
                    
                }
                else
                {
                    if( x1+rayonBall >= PosX*j && x1-rayonBall <= PosX*j+blocFull && y1+rayonBall >= PosY*(i+1) && y1-rayonBall <= PosY*(i+1)+blocFull && TabJeu[i][j][0] == 2) // permet de voir s'il y collision avec un bonus
                    {
                        TabJeu[i][j][0]=0;
                        colBonus++;
                    }
                }
                
            }
        }
        if((x1 + dx1 > gameWorld.width-rayonBall) || (x1 + dx1 < rayonBall)) // détecte les collision sur de gauche et droite
        {
            dx1 = -dx1;
        }
        if(y1 + dy1 < rayonBall)  // détecte la collision en haut
        {
            dy1 = -dy1;
        }
        if(y1 + dy1 > gameWorld.height-12.5) // détecte la collision en bas
        {
            clearInterval(idInt);
            finTire++;
            if(finTire == nbrBalle)
            {
                vieCube++;
                nbrBalle += colBonus;
                Score();
                NbrBalle();
                BlocMAJ();
                gameOver();  
            }
            
            dessinerBloc();
            dessinerBall(x,y);
            dessinerLigneRouge();   
                
        }
        else
        {
            x1 += dx1;
            y1 += dy1;
            dessinerBloc();
            dessinerBall(x1,y1); 
        }
        
    },10);
    
}

// Prends les coordonnées de départs de la ball + signal un tire en cours
function CoordonneesDepTire()
{
    departX = x;
    departY = y;
    tirEnCours = true;
}

// Dessine un trait entre la position de la balle et le cursuer de souris
function dessinerTrajectoireTire(e)
{
    e = window.event;// permet de récupérer le curseur plus tard
    if (tirEnCours) 
    {
        // Effacer le gameworld
        c.clearRect(0, 0, gameWorld.width, gameWorld.height);
        
        dessinerBloc();
        dessinerBall(x,y);
        dessinerLigneRouge();
        
        
        var rect = gameWorld.getBoundingClientRect();
        // Dessiner la ligne de direction du tir
        c.beginPath();
        c.lineWidth = 3;
        c.strokeStyle = 'white';
        c.moveTo(departX, departY);
        c.lineTo(e.clientX-rect.left, e.clientY-rect.top);
        c.stroke();
        
        // Enregistrer la position finale du tir
        finX = e.clientX-rect.left; // récupère la position du curseur X
        finY = e.clientY-rect.top; // récupère la position du curseur Y
        c.closePath();
    } 
}

// Calcule la trajectoire que la balle doit suivre 
function CalculerTrajectoireTire()
{
    var dx,dy;
    var i = 0;
    if (tirEnCours) 
    {
        c.clearRect(0, 0, gameWorld.width, gameWorld.height);
        removeEventListenerTire();
        tirEnCours = false;
        
        deltaX = finX-x; 
        deltaY = finY-y;

        distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        dx = (deltaX/distance)*6; //permet d'augmenter la vitesse de déplacement de laballe
        dy = (deltaY/distance)*6; //permet d'augmenter la vitesse de déplacement de laballe
        
        finTire = 0; // remet à jour pour le prochain tire
        colBonus =0; // remet à jour pour le prochain tire
        while(i < nbrBalle)
        {
            if(i % 2 === 0)
            {
                TirerBall(dx,dy,x,y);
            }
            else
            {
                setTimeout(function(){TirerBall(dx,dy,x,y)},30);
            }
            i++;
        }
    }
}

// Ajoute la possibilité de tirer
function addEventListenerTire()
{
    gameWorld.addEventListener("mousedown",CoordonneesDepTire,true);

    gameWorld.addEventListener("mousemove",dessinerTrajectoireTire,true);

    gameWorld.addEventListener("mouseup", CalculerTrajectoireTire,true);
}

// Retire la possibilité de tirer
function removeEventListenerTire()
{
    gameWorld.removeEventListener("mousedown",CoordonneesDepTire,true);

    gameWorld.removeEventListener("mousemove",dessinerTrajectoireTire,true);

    gameWorld.removeEventListener("mouseup", CalculerTrajectoireTire,true);
}

// permet de signalisé la fin de partie
function gameOver()
{
    for(var i = 0;i<TabJeu[0].length;i++)
    {
        if(TabJeu[TabJeu.length-1][i][0] == 1)
        {
            //nouveau evenement qui va nous servir a envoyer le score dans le controleur de la page
            var evenement = new CustomEvent('update-score', {detail: vieCube});
            //envoie l'evenement
            window.dispatchEvent(evenement);
            alert("GAME OVER");
            removeEventListenerTire();
            i = TabJeu[0].length;
        }
        else
        {
            addEventListenerTire();
        }
    }
}

