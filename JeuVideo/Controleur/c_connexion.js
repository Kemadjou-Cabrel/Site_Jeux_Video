const FormConnexion = document.forms['FormConnexion'];
FormConnexion.onsubmit = function verifInscri(event) 
{
    event.preventDefault();

    var name = FormConnexion.Pseudo.value;
    var password =FormConnexion.Mdp.value;
    let message = document.getElementById("connexion");

    message.innerHTML ="";

    //pseudo
    if (name == "") {
        let erreur = document.getElementsByName("Pseudo");
        erreur[0].className = "form_control_erreur";
        erreur[0].placeholder = "Encodez un pseudo !";
        return false;
    }
    else
    {
        let erreur = document.getElementsByName("Pseudo");
        erreur[0].className = "form_control";
        erreur[0].placeholder = "Pseudo";
    }

    //mot de passe
    if (password == "") {
        let erreur = document.getElementsByName("Mdp");
        erreur[0].className = "form_control_erreur";
        erreur[0].placeholder = "Encodez un mot de passe !";
        return false;
    }
    else
    {
        let erreur = document.getElementsByName("Mdp");
        erreur[0].className = "form_control";
        erreur[0].placeholder = "Mot de passe";
    }

    let datas = new FormData();
    datas.append("Pseudo", name);
    datas.append("Mdp", password);
    // requete AJAX
    let request = $.ajax({
    type: 'POST',
    url: 'Controleur/c_connexion.php',
    data: datas,
    dataType: 'json',
    processData: false, 
    contentType: false,
    async: false     // execute de manière synchrone pour pouvoir éxecuter les fonction qui suivent        
    });

    request.done(function(output_success)
    {
        if(output_success.error == false)
        {
            sessionStorage.setItem('username',output_success.pseudo);
            window.location.replace("./index.html");
        }
        else
        {
            message.innerHTML = output_success.message;
            message.style.color = "red";
            message.style.fontSize = "18px";
        }

    });
    
    request.fail(function(http_error)
    {
        let server_msg = http_error.responseText;
        let code = http_error.status;
        let code_label = http_error.statusText;
        alert("Erreur "+code+" ("+code_label+") : "+server_msg);
    });
}
                     
                     
                 