document.addEventListener("DOMContentLoaded", function () {

    // ── URL del tuo Google Sheet pubblicato come CSV ──────────────────────────
    // (vedi istruzioni sotto per ottenere questo URL)
    const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJ1zOuU36TZ7BC21hIr-OPKMNcOscWlbcVQ5Tv4NeVlazd5B6fvoPOo6y_W6srAND4aCS4ks9D9bbp/pub?gid=0&single=true&output=csv";

    let dateBusy = [];

    function initCalendario() {
        const flatpickrInstance = flatpickr("#data", {
            dateFormat: "Y-m-d",
            minDate: "today",
            locale: "it",
            position: "auto right",
            disable: [
                function(date) {
                    return date.getDay() === 0; // disabilita domeniche
                }
            ],
            onChange: function (selectedDates, dateStr) {
                verificaCampi();

                const statusBox = document.getElementById('data-status');
                if (!statusBox) return;

                if (!dateStr) {
                    statusBox.style.display = 'none';
                    return;
                }

                statusBox.style.display = 'flex';

                if (dateBusy.includes(dateStr)) {
                    statusBox.className = 'data-status status-busy';
                    statusBox.innerHTML = '⚠️ <span>Questa data ha già appuntamenti in programma. Puoi comunque procedere.</span>';
                } else {
                    statusBox.className = 'data-status status-available';
                    statusBox.innerHTML = '✅ <span>Data disponibile!</span>';
                }
            },
            onDayCreate: function (dObj, dStr, fp, dayElem) {
                const date = dayElem.dateObj;
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}-${mm}-${dd}`;

                if (date.getDay() === 0) {
                    dayElem.classList.add('day-sunday');
                } else if (dateBusy.includes(dateStr)) {
                    dayElem.classList.add('day-busy');
                } else {
                    dayElem.classList.add('day-available');
                }
            }
        });

        // Apri/chiudi il calendario quando si clicca sull'icona
        const calendarButton = document.getElementById('calendar-button');
        let closedByButton = false;
        if (calendarButton) {
            calendarButton.addEventListener('mousedown', function (e) {
                // Se il calendario è aperto, segna che stiamo chiudendo noi
                if (flatpickrInstance.isOpen) {
                    closedByButton = true;
                }
            });
            calendarButton.addEventListener('click', function (e) {
                e.stopPropagation();
                if (closedByButton) {
                    closedByButton = false;
                    flatpickrInstance.close();
                } else {
                    flatpickrInstance.open();
                }
            });
        }

        // Chiudi con Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && flatpickrInstance.isOpen) {
                flatpickrInstance.close();
            }
        });

        // Apri con Enter/Invio sull'input data
        const dataInput = document.getElementById('data');
        if (dataInput) {
            dataInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (flatpickrInstance.isOpen) {
                        flatpickrInstance.close();
                    } else {
                        flatpickrInstance.open();
                    }
                }
            });
        }

        return flatpickrInstance;
    }

    // Carica le date occupate dal Google Sheet, poi inizializza il calendario
    if (SHEET_CSV_URL !== "INSERISCI_QUI_URL_CSV_GOOGLE_SHEET") {
        fetch(SHEET_CSV_URL + '&cachebust=' + Date.now())
            .then(res => res.text())
            .then(csv => {
                console.log('📅 CSV caricato:', csv);
                // Ogni riga del CSV è una data nel formato YYYY-MM-DD
                dateBusy = csv.split('\n')
                    .map(r => r.trim().replace(/"/g, ''))
                    .filter(r => /^\d{4}-\d{2}-\d{2}$/.test(r));
                console.log('📅 Date occupate:', dateBusy);
                initCalendario();
            })
            .catch(() => {
                // In caso di errore carica comunque il calendario
                initCalendario();
            });
    } else {
        initCalendario();
    }

    const continuaBtn = document.getElementById('continua-btn');
    const form = document.getElementById('form');

    const telefonoInput = document.getElementById('telefono');
    const erroreTelefono = document.getElementById('errore-telefono');

    function telefonoValido(val) {
        // Rimuove spazi, trattini e il prefisso + per contare solo le cifre
        const solocifre = val.replace(/[\s\-]/g, '').replace(/^\+/, '');
        return /^[\d]{6,15}$/.test(solocifre);
    }

    function verificaCampi() {
        const campiRequired = form.querySelectorAll('[required]');
        let tuttiCompilati = true;

        campiRequired.forEach(campo => {
            if (!campo.value.trim()) {
                tuttiCompilati = false;
            }
        });

        // Blocca anche se il telefono non è valido
        if (telefonoInput.value && !telefonoValido(telefonoInput.value)) {
            tuttiCompilati = false;
        }

        continuaBtn.disabled = !tuttiCompilati;
    }

    form.addEventListener('input', verificaCampi);

    let telefonoToccato = false;

    function aggiornaTelefonoErrore() {
        const val = telefonoInput.value;
        if (telefonoToccato && val && !telefonoValido(val)) {
            erroreTelefono.textContent = 'Inserisci un numero di telefono valido (min. 6 cifre).';
            telefonoInput.setAttribute('aria-invalid', 'true');
        } else {
            erroreTelefono.textContent = '';
            telefonoInput.removeAttribute('aria-invalid');
        }
    }

    telefonoInput.addEventListener('blur', () => {
        telefonoToccato = true;
        aggiornaTelefonoErrore();
        verificaCampi();
    });

    telefonoInput.addEventListener('input', () => {
        aggiornaTelefonoErrore();
        verificaCampi();
    });

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
