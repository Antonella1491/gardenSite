document.addEventListener("DOMContentLoaded", function () {
    const flatpickrInstance = flatpickr("#data", {
        dateFormat: "Y-m-d",
        minDate: "today",
        locale: "it",
        disableMobile: true,
        onChange: function() {
            verificaCampi();
        }
    });

    // Apri il calendario quando si clicca sull'icona
    const calendarButton = document.getElementById('calendar-button');
    if (calendarButton) {
        calendarButton.addEventListener('click', function() {
            flatpickrInstance.open();
        });
    }

    const continuaBtn = document.getElementById('continua-btn');
    const form = document.getElementById('form');

    function verificaCampi() {
        const campiRequired = form.querySelectorAll('[required]');
        let tuttiCompilati = true;

        campiRequired.forEach(campo => {
            if (!campo.value) {
                tuttiCompilati = false;
            }
        });

        continuaBtn.disabled = !tuttiCompilati;
    }

    form.addEventListener('input', verificaCampi);

    const emailInput = document.getElementById('email');
    const erroreEmail = document.getElementById('errore-email');

    emailInput.addEventListener('input', () => {
        if (emailInput.validity.typeMismatch) {
            erroreEmail.textContent = 'Inserisci un indirizzo email valido.';
        } else {
            erroreEmail.textContent = '';
        }
    });

    function caricaModale() {
        fetch('modale.html')
            .then(response => response.text())
            .then(data => {
                const body = document.querySelector('body');
                body.insertAdjacentHTML('beforeend', data);

                const modaleConferma = document.getElementById('modale-conferma');
                modaleConferma.style.display = 'flex';

                const confermaBtn = document.getElementById('conferma-btn');
                const annullaBtn = document.getElementById('annulla-btn');
                const chiudiBtn = document.querySelector('.chiudi-modale');

                confermaBtn.addEventListener('click', function () {
                    const nome = document.getElementById('nome').value;
                    const email = document.getElementById('email').value;
                    const telefono = document.getElementById('telefono').value;
                    const data = document.getElementById('data').value;
                    const messaggio = document.getElementById('messaggio').value;

                    const recapUrl = `recap.html?nome=${encodeURIComponent(nome)}&email=${encodeURIComponent(email)}&telefono=${encodeURIComponent(telefono)}&data=${encodeURIComponent(data)}&messaggio=${encodeURIComponent(messaggio)}`;
                    window.location.href = recapUrl;
                });

                function chiudiModale() {
                    modaleConferma.style.display = 'none';
                }

                annullaBtn.addEventListener('click', chiudiModale);
                chiudiBtn.addEventListener('click', chiudiModale);
            })
            .catch(error => console.error('Errore nel caricare la modale:', error));
    }

    continuaBtn.addEventListener('click', function () {
        caricaModale();
    });

    verificaCampi();
});
