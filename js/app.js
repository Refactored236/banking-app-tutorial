//Constants
const routes = {
    '/login': {  title: 'Login', templateId: 'login' },
    '/dashboard': { title: 'My Dashboard', templateId: 'dashboard' },
    '/credits': { title: 'App Credits', templateId: 'credits' }

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

    //Updates the title
    document.title = route.title;
}

function navigate(path){
    //update the URL and then handle routing
    window.history.pushState({}, path, window.location.origin + path);
    updateRoute();
}

function onLinkClick(event) {
    //We don't want the HTML to reload as we are using custom JS routing
    event.preventDefault();
    navigate(event.target.href);
  }

  //Run Time calls

  //Handle browser back/forward
  window.onpopstate = () => updateRoute();

  //Initial call to set route
  updateRoute();