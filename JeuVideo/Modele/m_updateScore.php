<?php
    include("./m_connexion.php");

    $conn = connecte();

    if ($_SERVER['REQUEST_METHOD'] === 'POST'){
        $username = $_POST['username'];
        $score = $_POST['score'];
        $GameId = $_POST['GameId'];

        $sql = "SELECT score FROM classement WHERE classement.idJeux = '$GameId' AND classement.pseudoUser = '$username'"; // Récupère le score de l'utilisateur encodé
        $resultat = mysqli_query($conn,$sql); // effectue la requête sql 
        $row = mysqli_fetch_assoc($resultat); //transforme le resultat de la requete en tableau

        if ($row !== NULL)
        {
            if ($row['score'] < $score) {
                $sql = "UPDATE classement SET score = '$score' WHERE classement.idJeux = '$GameId' AND classement.pseudoUser = '$username'"; // modifie le score de l'utilisateur encodé

                mysqli_query($conn,$sql);

                echo json_encode(['success' => true]);
                mysqli_close($conn); //ferme la connection
                return;
            }
        }
        else {
            $sql = "INSERT INTO classement (pseudoUser, idJeux, score) VALUES (?, ?, ?)";
            $stmt = mysqli_stmt_init($conn);

            if(!mysqli_stmt_prepare($stmt, $sql)){ //verifie si il y'a erreur avec sql
                die("Connection failed: " . $conn->connect_error);
            } else{
                mysqli_stmt_bind_param($stmt, "sss", $username, $GameId, $score);
                mysqli_stmt_execute($stmt);

                echo json_encode(['success' => true]);
                mysqli_close($conn); //ferme la connection
                return;
            }   
        }

        echo json_encode(['success' => false]);

        mysqli_close($conn);
    }
?>