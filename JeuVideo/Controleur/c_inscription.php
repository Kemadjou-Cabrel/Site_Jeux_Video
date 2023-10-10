<?php
include("../Modele/m_connexion.php");
$Output = array("error" => false, "message" => "N/A");
if(isset($_POST['Pseudo']) && isset($_POST['Mdp']) && isset($_POST['Email']) && isset($_POST['MdpConf']))
{
    if($_POST['Pseudo'] == '')
    {
        $error = "Veuillez entrez Nom d'utlisateur !";
        $Output["error"] = true;
        $Output["message"] = $error;
    }
    else
    {
        if($_POST['Mdp'] == '')
        {
            $error = "Veuillez entrer un mot de passe !"; 
            $Output["error"] = true;
            $Output["message"] = $error;
        }
        else
        {
            $mdp = password_hash($_POST['Mdp'],PASSWORD_BCRYPT);
            $nom = $_POST['Pseudo']; 
            $email = $_POST['Email'];
            $inscription = Inscription($nom,$mdp,$email);
            if($inscription == 0)
            {
                $succes = "Inscription réussie !";
                $Output["message"] = $succes;
                $Output["error"] = false;
            }
            else
            {
                if($inscription == 1)
                {
                    $error = "Nom d'utilisateur déjà utilisé !";
                    $Output["error"] = true;
                    $Output["message"] = $error;
                }
                else
                {
                    $error = "Impossible de se connecter à la base de données !";
                    $Output["error"] = true;
                    $Output["message"] = $error;
                }
            }
        }
    }
    echo json_encode($Output,JSON_FORCE_OBJECT);
}
?>