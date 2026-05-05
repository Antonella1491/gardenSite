// Inizializza EmailJS (v4)
emailjs.init({ publicKey: 'KfeKbfvg84r-kG6o0' });

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

// Invia email tramite EmailJS
document.getElementById('mail-link').addEventListener('click', function () {
    const btn = this;
    btn.disabled = true;
    btn.textContent = 'Invio in corso...';

    emailjs.send('service_7co91rs', 'template_iadvjet', {
        title: 'Nuovo Appuntamento',
        name: nome,
        email: email,
        time: data,
        message: messaggio
    })
    .then(function () {
        window.location.href = 'conferma.html';
    })
    .catch(function (error) {
        console.error('Errore invio email:', error);
        btn.disabled = false;
        btn.textContent = 'Invia via email';
        alert('Errore durante l\'invio. Riprova più tardi.');
    });
});
