<?php

include("../Modele/m_connexion.php");

$Output = array("error" => false, "message" => "N/A", "pseudo" =>"N/A");

if(isset($_POST['Pseudo']) && isset($_POST['Mdp']))
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
                $mdp = $_POST['Mdp'];
                $nom = $_POST['Pseudo']; 
                $connexion = Connexion($nom);
                if(password_verify($mdp,$connexion))
                {
                    $succes = "Connexion réussie !";
                    $Output["message"] = $succes;
                    $Output["error"] = false;
                    $Output["pseudo"] = $nom;
                }
                else
                {
                    if(!password_verify($mdp,$connexion))
                    {
                        $error = "Nom d'utilisateur ou mot de passe invalide !";
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