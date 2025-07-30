// Funzione che attiva l'animazione quando l'elemento entra nel viewport
function handleScrollAnimation() {
  const leftElements = document.querySelectorAll('.slide-in-left');
  const rightElements = document.querySelectorAll('.slide-in-right');
  const upElements = document.querySelectorAll('.slide-up');
  const downElements = document.querySelectorAll('.slide-down'); // Aggiunto per gli elementi che scendono dall'alto

  const triggerBottom = window.innerHeight * 0.85;

  // Animazioni da sinistra e da destra
  [...leftElements, ...rightElements].forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      if (el.classList.contains('slide-in-left')) {
        el.classList.add('animate-left');
      } else if (el.classList.contains('slide-in-right')) {
        el.classList.add('animate-right');
      }
    }
  });

  // Animazioni dall'alto
  upElements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add('visible');
    }
  });

  // Animazioni che scendono dall'alto
  downElements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add('visible');
    }
  });
}

// Aggiunge l'evento scroll alla pagina e l'evento di caricamento iniziale
window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);

// Caricamento header
fetch('Header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header-container').innerHTML = data;
  });

// Caricamento footer
fetch('Footer.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('footer-container').innerHTML = data;
  });

// Tasto "Scroll to Top"
window.addEventListener('scroll', function () {
  const scrollBtn = document.getElementById('scrollToTop');
  if (!scrollBtn) return;

  if (window.pageYOffset > 20) {
    scrollBtn.style.display = 'flex';
  } else {
    scrollBtn.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const scrollBtn = document.getElementById('scrollToTop');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Bottone per aprire Prenotazione.html in nuova scheda
  const openTabBtn = document.getElementById('openInNewTab');
  if (openTabBtn) {
    openTabBtn.addEventListener('click', function () {
      window.open('Prenotazione.html', '_blank');
    });
  }
});
