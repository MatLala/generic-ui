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
    inputLogin.name = 'login';
    inputLogin.setAttribute('type', 'text');
    inputLogin.setAttribute('placeholder', 'Username');
    inputLogin.setAttribute('autofocus', 'autofocus');
    
    var inputPassword = document.createElement('input');
    inputPassword.id = 'signinPassword';
    inputPassword.className = 'signinInput';
    inputPassword.name = 'password'
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
        event.preventDefault();
        var res = damas.signIn(signinForm.elements['login'].value, signinForm.elements['password'].value, function( res ) {
            if (!res) {
                //say to user username or password is wrong
                return;
            }
            if (localStorage) {
                localStorage.setItem("token", damas.token);
                damas.user.token = undefined;
                localStorage.setItem("user", JSON.stringify(damas.user));
            }
            document.location.replace('/');
        });
        return false;
    });
    
    container.style.textAlign = "center";
    container.appendChild(signinForm);
};
