<?php
include("../Modele/m_connexion.php");
$Output = array("error" => false, "message" => "N/A");

if(isset($_POST['idJeu']))
{
    $id=$_POST['idJeu'];
    $description = Description($id);
    if($description == 1)
    {
        $error = "Description du jeu non trouvée";
        $Output["error"] = true;
        $Output["message"] = $error;
    }
    else
    {
        if($description == 2)
        {
            $error = "Impossible de se connecter à la base de données !";
            $Output["error"] = true;
            $Output["message"] = $error;
        }
        else
        {
            $Output["error"] = false;
            $Output["message"] = $description; 
        }
    }
}
else
{
    $error = "Erreur d'envoie des données lors de la requête";
    $Output["error"] = true;
    $Output["message"] = $error;
}
   
    

echo json_encode($Output,JSON_FORCE_OBJECT);

?>