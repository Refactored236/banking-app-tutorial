//Constants
const routes = {
    '/login': { templateId: 'login' },
    '/dashboard': { templateId: 'dashboard' }
}

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
}

function navigate(path){
    //update the URL and then handle routing
    window.history.pushState({}, path, window.location.origin + path);
    updateRoute();
}

function onLinkClick(event) {
    //We don't want the HTML to reload as we are using custom JS routing
    //console.log(event);
    
    event.preventDefault();
    //console.log(event.target.href);
    navigate(event.target.href);
  }

updateRoute();