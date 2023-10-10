<?php

//pour ne pas ajouter le mysqli chaque fois (plus pratique si plusieur machine)
function connecte(){
    $conn = mysqli_connect("localhost", "root", "", "jeuxvideo");

    if(!$conn){
        return false;
    }
    else return $conn;
}

function Inscription($pseudo,$password,$email) // $pseudo = le nom de l'utilisateur et $password = mdp
{
    $connect = connecte(); // se connecte à la base de données
    //$connect = mysqli_connect("127.0.0.1:3306","tubmbjbv","8aUC7hYRPDfsdq","tubmbjbv_Projet_fin_annee");
    if($connect !== false)
    {
        $sql = "INSERT INTO utilisateur (pseudo,mdp,email) VALUES ('$pseudo','$password','$email')"; // Insere les valeurs dans la base de données
        if (mysqli_query($connect, $sql)) // effectue la requête sql
        {
            $valeur = 0; // renvoie 0 si tout va bien
        } else 
        {
            $valeur = 1; // renvoie 1 s'il ya un problème
        }
        mysqli_close($connect);  // ferme la connexion à la base de données

    }
    else
    {
        $valeur = 2; // renvoie 2 s'il elle ne trouve pas la base de données
    }

    return $valeur;
}

function Connexion($pseudo) // parametre pseudo de l'utilisateur
{
    $connect = connecte(); // se connecte à la base de données
    //$connect = mysqli_connect($host,$username,$pwd,$databasename); // se connecte à la base de données
    //$connect = mysqli_connect("127.0.0.1:3306","tubmbjbv","8aUC7hYRPDfsdq","tubmbjbv_Projet_fin_annee");
    if($connect !== false)
    {
        $sql = "SELECT mdp FROM utilisateur WHERE utilisateur.pseudo = '$pseudo'"; // Récupère le mot de passe de l'utilisateur encodé
        $resultat = mysqli_query($connect,$sql); // effectue la requête sql 
        $row = mysqli_fetch_array($resultat,MYSQLI_BOTH); //transforme le resultat de la requete en tableau
        
        if ($row !== NULL)
        {
            $valeur = $row['mdp'] ; // copie la valeur du mot de passe dans $valeur
        } else 
        {
            $valeur = 1; // renvoie 1 s'il ya un problème
        }
        mysqli_close($connect);  // ferme la connexion à la base de données

    }
    else
    {
        $valeur = 2; // renvoie 2 s'il elle ne trouve pas la base de données
    }

    return $valeur;
}

function Classement($Idjeu)
{
    $connect = connecte(); // se connecte à la base de données
    //$connect = mysqli_connect($host,$username,$pwd,$databasename); // se connecte à la base de données
    //$connect = mysqli_connect("127.0.0.1:3306","tubmbjbv","8aUC7hYRPDfsdq","tubmbjbv_Projet_fin_annee");
    if($connect !== false)
    {
        $sql = "SELECT pseudoUser,score FROM classement WHERE idJeux = $Idjeu ORDER BY classement.score DESC LIMIT 10"; // Récupère le top 10 du classment encodé
        $resultat = mysqli_query($connect,$sql); // effectue la requête sql 
        $row = mysqli_fetch_assoc($resultat); //transforme le resultat de la requete en tableau 
        
        if ($row !== NULL)
        {
            $valeur[] = $row ;
            while($row = mysqli_fetch_assoc($resultat))
            {
                $valeur[] = $row ; // copie le tableau dans $valeur 
            }
        } else 
        {
            $valeur = 1; // renvoie 1 s'il ya un problème
        }
        mysqli_close($connect);  // ferme la connexion à la base de données

    }
    else
    {
        $valeur = 2; // renvoie 2 s'il elle ne trouve pas la base de données
    }

    return $valeur;
}

function Description($Idjeu)
{
    $connect = connecte(); // se connecte à la base de données
    //$connect = mysqli_connect($host,$username,$pwd,$databasename); // se connecte à la base de données
    //$connect = mysqli_connect("127.0.0.1:3306","tubmbjbv","8aUC7hYRPDfsdq","tubmbjbv_Projet_fin_annee");
    if($connect !== false)
    {
        $sql = "SELECT libelle FROM jeux WHERE jeux.id = '$Idjeu'"; // Récupère la description du jeu
        $resultat = mysqli_query($connect,$sql); // effectue la requête sql 
        $row = mysqli_fetch_array($resultat,MYSQLI_BOTH); //transforme le resultat de la requete en tableau
        
        if ($row !== NULL)
        {
            $valeur = $row[0] ; // copie la valeur du libelle dans $valeur
        } else 
        {
            $valeur = 1; // renvoie 1 s'il ya un problème
        }
        mysqli_close($connect);  // ferme la connexion à la base de données

    }
    else
    {
        $valeur = 2; // renvoie 2 s'il elle ne trouve pas la base de données
    }

    return $valeur;
}

?>