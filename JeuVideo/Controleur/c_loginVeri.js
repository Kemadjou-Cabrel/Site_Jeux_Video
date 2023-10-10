// affichage de certains éléments si connecté ou non
let username = sessionStorage.getItem('username');
let signin = document.getElementById("signin");
let signup = document.getElementById("signup");
let logout = document.getElementById("logout");
let classement = document.getElementById("classement");

if(username != null)
{
   username = document.getElementById("username");
   username.innerHTML = sessionStorage.getItem('username'); 

   logout.addEventListener("click",function(){
      let result = confirm("Voulez-vous vraiment vous déconnecter ?");
      if(result)
      {
         sessionStorage.removeItem('username');
         window.location.replace("index.html");
      }
   });
   logout.style.display = "relative";
   classement.style.display = "relative";
   signin.style.display = "none";
   signup.style.display = "none";
}
else
{
   alert("Veuillez vous connecter");
   window.location.replace("./connexion.html");
}