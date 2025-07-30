// Otteniamo i parametri passati nell'URL
const params = new URLSearchParams(window.location.search);

// Estraiamo i dati dal URL
const nome = params.get('nome');
const email = params.get('email');
const data = params.get('data');
const messaggio = params.get('messaggio');

// Mostriamo i dati nella pagina di recap
document.getElementById('nome').textContent = nome;
document.getElementById('email').textContent = email;
document.getElementById('data').textContent = data;
document.getElementById('messaggio').textContent = messaggio;

// Prepara il link per inviare via email con i dati
const body = `Nome: ${nome}%0AEmail: ${email}%0AData dell'appuntamento: ${data}%0AMessaggio: ${messaggio}`;
document.getElementById('mail-link').href = `mailto:giardiniere@email.it?subject=Nuovo Appuntamento&body=${body}`;
