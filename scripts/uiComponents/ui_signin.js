/**
* HTML rendering methods for UI Components inside Layout
* require html container
* require damas.js
* call by process_hash function from main.js
*/

/**
* Generate Component : Login
* 
*/
compSignin = function(container){
    var signinForm = document.createElement('form');
    signinForm.id = 'signinForm';
    
    var inputsBlocks = document.createElement('div');
    inputsBlocks.id = 'signinBox';
    
    var inputLogin = document.createElement('input');
    inputLogin.id = 'signinLogin';
    inputLogin.className = 'signinInput';
    inputLogin.setAttribute('type', 'text');
    inputLogin.setAttribute('placeholder', 'Username');
    inputLogin.setAttribute('autofocus', 'autofocus');
    
    var inputPassword = document.createElement('input');
    inputPassword.id = 'signinPassword';
    inputPassword.className = 'signinInput';
    inputPassword.setAttribute('type', 'password');
    inputPassword.setAttribute('placeholder', 'Password');
    
    var signinBt = document.createElement('button');
    signinBt.id = 'signinConnexion';
    signinBt.className = 'signinBt clickable';
    signinBt.setAttribute('type', 'submit');
    signinBt.setAttribute('rel', 'authentification');
    signinBt.innerHTML = 'Connexion';
    
    inputsBlocks.appendChild(inputLogin);
    inputsBlocks.appendChild(inputPassword);
    signinForm.appendChild(inputsBlocks);
    signinForm.appendChild(signinBt);
    
    signinForm.addEventListener('submit', function(event){
        
    });
    
    container.style.textAlign = "center";
    container.appendChild(signinForm);
};