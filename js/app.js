//Constants
const routes = {
    '/login': {  title: 'Login', templateId: 'login' },
    '/dashboard': { title: 'My Dashboard', templateId: 'dashboard' },
    '/credits': { title: 'App Credits', templateId: 'credits' }

}

const userDuplicateError = 'User already exists';

// Functions
function updateRoute(){
    //Get the select route based on the current url (path section only)
    const path = window.location.pathname;
    const route = routes[path];

    //If invalid route is selected then use login as default for now
    if (!route) {
        return navigate('/login');
    }

    console.log(route.templateId);

    const template = document.getElementById(route.templateId);
    const view = template.content.cloneNode(true);
    const app  =document.getElementById('app');
    // Clear any existing content in the app DIV
    app.innerHTML = '';
    app.appendChild(view);

    //Updates the title
    document.title = route.title;
}

function navigate(path){
    //update the URL and then handle routing
    window.history.pushState({}, path, window.location.origin + path);
    updateRoute();
}

function onLinkClick(event){
    //We don't want the HTML to reload as we are using custom JS routing
    event.preventDefault();
    navigate(event.target.href);
  }

async function register(){
    const registerForm = document.getElementById('registerForm');
    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData);
    const jsonData = JSON.stringify(data);
    const result = await createAccount(jsonData);
    const errorDiv = document.getElementById('registrationError');

    if (result.error) {
        if (result.error == userDuplicateError) {
            errorDiv.innerHTML = 'Username already registered!';
        }
        return console.log('An error occured:', result.error);
      }
    
    console.log('Account created!', result);
}

async function createAccount(account){
    try {
        const response = await fetch('//localhost:5000/api/accounts', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: account
        });
        return await response.json();

    } catch (error) {
        return {error: error.message || 'Unknown Error'};        
    }
}
  //Run Time calls

  //Handle browser back/forward
  window.onpopstate = () => updateRoute();

  //Initial call to set route
  updateRoute();