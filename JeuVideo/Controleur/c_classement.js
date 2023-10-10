// récupération des éléments nécessaires sur la page classement
let d1 = document.getElementById("d1");
let d2 = document.getElementById("d2");
let d3 = document.getElementById("d3");
let d4 = document.getElementById("d4");
let d5 = document.getElementById("d5");
let d6 = document.getElementById("d6");
let button1 = document.getElementById("b1");
let button2 = document.getElementById("b2");
let button3 = document.getElementById("b3");
let button4 = document.getElementById("b4");
let button5 = document.getElementById("b5");
let button6 = document.getElementById("b6");
let image1 = document.getElementById("i1");
let image2 = document.getElementById("i2");
let image3 = document.getElementById("i3");
let image4 = document.getElementById("i4");
let image5 = document.getElementById("i5");
let image6 = document.getElementById("i6");

// ajout des eventlistener
button1.addEventListener("click",function(){AfficherClassement(1,d1,button1,image1)});
button2.addEventListener("click",function(){AfficherClassement(2,d2,button2,image2)});
button3.addEventListener("click",function(){AfficherClassement(3,d3,button3,image3)});
button4.addEventListener("click",function(){AfficherClassement(4,d4,button4,image4)});
button5.addEventListener("click",function(){AfficherClassement(5,d5,button5,image5)});
button6.addEventListener("click",function(){AfficherClassement(6,d6,button6,image6)});

// afficher le classement du jeu selectionné et change le eventlistener click pour effacer le classement lors du second click
function AfficherClassement(id,desc,button,image)
{
    let tab = document.createElement("table"); // crée un élement table 
    tab.style.border = "1px solid black";
    tab.style.width = "100%";
    tab.setAttribute("id", id); // lui un id pour qu'il soit unique (mm que l'id du jeu dans la sgbd) pour voir le supprimer lors du second clique
    // requête AJAX pour chercher les information concernat le classement du jeu.
    let datas = new FormData()
    datas.append("idJeu", id);
    // requete AJAX pour aller chercher la description est l'afficher
    let request = $.ajax({
    type: 'post',
    url: 'Controleur/c_classement.php',
    data: datas,
    dataType: 'json',
    processData: false, 
    contentType: false,
    async: false     // execute de manière synchrone (attend de recevoir la réponse avant de continuer)     
    });

    request.done(function(output_success)
    { 
        image.style.display = "none";
        if(typeof output_success ==="string")
        {
            desc.innerHTML = output_success; // si pas de tableau reçu affiche la phrase string renvoyé par le serveur (le controleur php)
        }
        else
        {
            // sinon crée un tableau dynamiquement avec tous les score
            let i = 1;
            let ligne = document.createElement("tr");
            let colonne = document.createElement("td");
            let colonne1 = document.createElement("td");
            let colonne2 = document.createElement("td");
            colonne.style.border = "1px solid black";
            colonne.style.width = "10%";
            colonne.style.textAlign = "center"
            colonne1.style.border = "1px solid black";
            colonne1.style.width = "100%";
            colonne2.style.border = "1px solid black";
            colonne2.style.width = "100%";
            colonne2.style.textAlign = "center";
            colonne1.textContent = "Pseudo";
            colonne2.textContent = "Score";

            ligne.append(colonne);
            ligne.append(colonne1);
            ligne.append(colonne2);
            tab.append(ligne);
            
            output_success.forEach(element => {
            let lig = document.createElement("tr");
            let col = document.createElement("td");
            let col1 = document.createElement("td");
            let col2 = document.createElement("td");
            
            col.style.border = "1px solid black";
            col.style.textAlign = "center";
            col1.style.border = "1px solid black";
            
            col2.style.border = "1px solid black";
            
            col2.style.textAlign = "center";

            col.textContent = i;
            col1.textContent = element['pseudoUser'];
            col2.textContent = element['score'];
            
            lig.append(col);
            lig.append(col1);
            lig.append(col2);
            tab.append(lig);
            i++;
            });
            desc.append(tab);
        }
        
        desc.style.display = "block"; // permet d'afficher le tableau qui est "caché"
        button.addEventListener("click",function(){EffacerClassement(desc,button,id,image)}); // change le button

    });
    request.fail(function(http_error) // fail de la requête AJAX
    {
        let server_msg = http_error.responseText;
        let code = http_error.status;
        let code_label = http_error.statusText;
        alert("Erreur "+code+" ("+code_label+") : "+server_msg);
    });
}

function EffacerClassement(desc,button,id,image)
{
    let t = document.getElementById(id); // récupere le table
    image.style.display = "block";
    desc.style.display = "none";
    button.addEventListener("click",function(){AfficherClassement(id,desc,button,image)});
    desc.removeChild(t); // supprimer le table
    
}