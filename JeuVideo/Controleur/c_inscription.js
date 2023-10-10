const FormInscri = document.forms['FormInscription'];

FormInscri.onsubmit = function verifInscri(event) 
{
    event.preventDefault();

    var name = FormInscri.Pseudo.value;
    var email = FormInscri.Email.value;
    var password =FormInscri.Mdp.value;
    var password2 = FormInscri.MdpConf.value;
    let message = document.getElementById("inscription");

    message.innerHTML ="";
    
    // pseudo
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
    //email
    if (email == "") {
        let erreur = document.getElementsByName("Email");
        erreur[0].className = "form_control_erreur";
        erreur[0].placeholder = "Encodez une email !";
        return false;
    }
    else
    {
        if (email.indexOf("@", 0) < 0) {
            let erreur = document.getElementsByName("Email");
            erreur[0].className = "form_control_erreur";
            erreur[0].placeholder = "Encodez une email valide !";
            erreur[0].value = "";
            return false;
        }
        else
        {

            if (email.indexOf(".", 0) < 0) {
                let erreur = document.getElementsByName("Email");
                erreur[0].className = "form_control_erreur";
                erreur[0].placeholder = "Encodez une email valide !";
                erreur[0].value = "";
                return false;
            }
            else
            {
                let erreur = document.getElementsByName("Email");
                erreur[0].className = "form_control";
                erreur[0].placeholder = "Email";
            }
        }
        
    }

    //Mot de passe
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
    if(password != password2){
        let erreur = document.getElementsByName("MdpConf");
        erreur[0].className = "form_control_erreur";
        erreur[0].value = "";
        erreur[0].placeholder = "Veuillez encoder le même mot de passe !";
        return false;
    }
    else
    {
        let erreur = document.getElementsByName("MdpConf");
        erreur[0].className = "form_control";
        erreur[0].placeholder = "Confirmer mot de passe";
    }

    let datas = new FormData();
    datas.append("Pseudo", name);
    datas.append("Email", email);
    datas.append("Mdp", password);
    datas.append("MdpConf", password2);
    // requete AJAX
    let request = $.ajax({
    type: 'POST',
    url: 'Controleur/c_inscription.php',
    data: datas,
    dataType: 'json',
    processData: false, 
    contentType: false,
    async: false     // execute de manière synchrone pour pouvoir éxecuter les fonction qui suivent        
    });

    request.done(function(output_success)
    {
        
        //alert(output_success.message);
        if(output_success.error == false)
        {
            message.innerHTML = output_success.message;
            message.style.color = "green";
            message.style.fontSize = "18px";
            FormInscri.reset();
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
                     
                     
                 