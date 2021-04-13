//Constants
const routes = {
    '/login': {  title: 'Login', templateId: 'login' },
    '/dashboard': { title: 'My Dashboard', templateId: 'dashboard', init: updateDashboard },
    '/credits': { title: 'App Credits', templateId: 'credits' }
}

const apiURL = '//localhost:5000/api';
const unknownError = 'Unknown Error';
const userDuplicateError = 'User already exists';

//Global Variables
let account = null;

// Functions
function updateRoute(){
    //Get the select route based on the current url (path section only)
    const path = window.location.pathname;
    const route = routes[path];

    //If invalid route is selected then use login as default for now
    if (!route) {
        return navigate('/login');
    }

    const template = document.getElementById(route.templateId);
    const view = template.content.cloneNode(true);
    const app  =document.getElementById('app');
    // Clear any existing content in the app DIV
    app.innerHTML = '';
    app.appendChild(view);

    //Updates the title
    document.title = route.title;
    
    //Execute function on init of dashboard
    if (typeof route.init === 'function') {
        route.init();
    }
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

    if (result.error) {
        if (result.error == userDuplicateError) {
            updateElement('registrationError', 'Username already registered!');
        }
        return console.log('An error occured:', result.error);
      }
    
    console.log('Account created!', result);

    account = result;
    navigate('/dashboard');
}

async function login(){
    const loginForm = document.getElementById('loginForm');
    const user = loginForm.user.value;
    const data = await getAccount(user);

    if (data.error) {
        return updateElement('loginError', data.error);
    }

    account = data;
    navigate('/dashboard');
}

// API Interactions
async function sendRequest(api, method, body) {
    try {
        
        const response = await fetch(apiURL + api, {
            method: method || 'GET',
            headers: body ? { 'Content-Type': 'application/json' } : undefined,
            body});
        
        return await response.json();

    } catch (error) {
        return {error: error.message || unknownError}; 
    }
}

async function createAccount(account){
    return sendRequest('/accounts', 'POST', account);
}

async function getAccount(user){
    return sendRequest('/accounts/' + encodeURIComponent(user));
}

// Dashboard Update Functions
function createTransactionRow(transaction){
    const template = document.getElementById('transaction');
    const transactionRow = template.content.cloneNode(true);
    const tr = transactionRow.querySelector('tr');
    tr.children[0].textContent = transaction.date;
    tr.children[1].textContent = transaction.object;
    tr.children[2].textContent = transaction.amount.toFixed(2);
    return transactionRow;
}

function updateDashboard() {
    if (!account) {
      return navigate('/login');
    }
  
    updateElement('description', account.description);
    updateElement('balance', account.balance.toFixed(2));
    updateElement('currency', account.currency);

    //Update the transactions
    const transactionsRows = document.createDocumentFragment();
    for (const transaction of account.transactions) {
        const transactionRow = createTransactionRow(transaction);
        transactionsRows.appendChild(transactionRow);
    }
    updateElement('transactions', transactionsRows);
  }

//General function to update an HTML element with test or nodes
function updateElement(id, textOrNode) {
    const element = document.getElementById(id);
    element.textContent = ''; // Removes all children
    //Using append to all for text or nodes to be added.
    element.append(textOrNode);
  }

//Run Time calls

  //Handle browser back/forward
  window.onpopstate = () => updateRoute();

  //Initial call to set route
  updateRoute();