<?php
include("../Modele/m_connexion.php");

if(isset($_POST['idJeu']))
{
    $id=$_POST['idJeu'];
    $classement = Classement($id);
    if($classement == 1)
    {
        $error = "Classement du jeu non trouvée";
        $out = $error;
    }
    else
    {
        if($classement == 2)
        {
            $error = "Impossible de se connecter à la base de données !";
            $out = $error;
        }
        else
        {
             
            $out = $classement;
        }
    }
}
else
{
    $error = "Erreur d'envoie des données lors de la requête";
    $out = $error;
}
   
echo json_encode($out);  


?>