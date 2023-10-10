// attend pour le evenement update-score
window.addEventListener('update-score', function(event) {
    let score = event.detail; // retrieve the score value from the event detail

    console.log(score);
    
    updateScore(score);
});

function updateScore(score)
{
    let GameId = document.getElementById('gameID').value;
    let username = sessionStorage.getItem('username');

    // envoyer valeur par ajax
    $.ajax({
        url: './Modele/m_updateScore.php',
        type: 'POST',
        dataType: 'json',
        data: {username, score, GameId},
        success: function(response) {
            if (response.success) {
                console.log(true);
                document.getElementById("newHighScore").innerHTML = 'NOUVEAU HIGHSCORE : ' + score;
                $("#newHighScore").show();
            }
            else
            {
                console.log(false);
                $("#newHighScore").hide();
            }
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
}