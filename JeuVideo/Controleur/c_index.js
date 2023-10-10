// variable des id
let j1 = document.getElementById("1");
let j2 = document.getElementById("2");
let j3 = document.getElementById("3");
let j4 = document.getElementById("4");
let j5 = document.getElementById("5");
let j6 = document.getElementById("6");
let d1 = document.getElementById("d1");
let d2 = document.getElementById("d2");
let d3 = document.getElementById("d3");
let d4 = document.getElementById("d4");
let d5 = document.getElementById("d5");
let d6 = document.getElementById("d6");

// ajout des eventlistener
j1.addEventListener("mousemove",function(){AfficherDescription(1,d1)});
j1.addEventListener("mouseout",function(){RetirerDescription(d1)});
j2.addEventListener("mousemove",function(){AfficherDescription(2,d2)});
j2.addEventListener("mouseout",function(){RetirerDescription(d2)});
j3.addEventListener("mousemove",function(){AfficherDescription(3,d3)});
j3.addEventListener("mouseout",function(){RetirerDescription(d3)});
j4.addEventListener("mousemove",function(){AfficherDescription(4,d4)});
j4.addEventListener("mouseout",function(){RetirerDescription(d4)});
j5.addEventListener("mousemove",function(){AfficherDescription(5,d5)});
j5.addEventListener("mouseout",function(){RetirerDescription(d5)});
j6.addEventListener("mousemove",function(){AfficherDescription(6,d6)});
j6.addEventListener("mouseout",function(){RetirerDescription(d6)});


function AfficherDescription(id,desc)
{
    let datas = new FormData()
    datas.append("idJeu", id);
    // requete AJAX pour aller chercher la description est l'afficher
    let request = $.ajax({
    type: 'post',
    url: 'Controleur/c_index.php',
    data: datas,
    dataType: 'json',
    processData: false, 
    contentType: false,
    async: false     // execute de manière synchrone pour pouvoir éxecuter les fonction qui suivent        
    });

    request.done(function(output_success)
    {
        desc.innerHTML = output_success.message;
        desc.style.display = "block";
    });
    request.fail(function(http_error)
    {
        let server_msg = http_error.responseText;
        let code = http_error.status;
        let code_label = http_error.statusText;
        //alert("Erreur "+code+" ("+code_label+") : "+server_msg);
        console.log("Erreur "+code+" ("+code_label+") : "+server_msg);
    });
}
function RetirerDescription(desc)
{
    desc.style.display = "none";
}