document.addEventListener("DOMContentLoaded", () => {

  const chatButton = document.getElementById("chatButton");
  const chatWindow = document.getElementById("chatWindow");
  const closeChat = document.getElementById("closeChat");
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");

  // Messaggio di benvenuto automatico
  let welcomeShown = false;
  function showWelcome() {
    if (!welcomeShown) {
      chatBox.innerHTML += `<p style='color:#3d913b;'><strong>Bot:</strong> Ciao! Sono il tuo assistente di giardinaggio 🌱<br>Scrivimi una domanda o chiedimi un consiglio!</p>`;
      chatBox.scrollTop = chatBox.scrollHeight;
      welcomeShown = true;
    }
  }


  chatButton.onclick = () => {
    chatWindow.style.display = "flex";
    chatButton.style.display = "none";
    userInput.focus();
    showWelcome();
    // Rimuovi badge notifica
    chatButton.removeAttribute('data-hasnew');
  };


  closeChat.onclick = () => {
    chatWindow.style.display = "none";
    chatButton.style.display = "flex";
    chatButton.focus();
  };


  sendBtn.onclick = async () => {
    const message = userInput.value.trim();
    if (!message) return;

    chatBox.innerHTML += `<p style="color:#3d913b;"><strong>Tu:</strong> ${message}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    userInput.value = "";

    chatBox.innerHTML += `<p id="waitingMsg" style="color:#cccccc;"><strong>Bot:</strong> Sto pensando...</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
      const res = await fetch("https://025fe154-3e43-4f1c-93c3-2dad1bec83ee-00-1hu0fnr2gt8c.riker.replit.dev/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      document.getElementById("waitingMsg").innerHTML = `<strong>Bot:</strong> ${data.reply}`;
      chatBox.scrollTop = chatBox.scrollHeight;
      // Mostra badge notifica se la chat è chiusa
      if (chatWindow.style.display === "none") {
        chatButton.setAttribute('data-hasnew', 'true');
      }
    } catch (error) {
      document.getElementById("waitingMsg").innerHTML =
        `<strong>Errore:</strong> impossibile rispondere ora.`;
      console.error(error);
    }
  };



  // Miglioramento UX: auto-scroll sempre attivo
  const observer = new MutationObserver(() => {
    chatBox.scrollTop = chatBox.scrollHeight;
  });
  observer.observe(chatBox, { childList: true });

  // Miglioramento UX: focus visivo su input
  userInput.addEventListener('focus', () => {
    userInput.style.outline = '2px solid #3d913b';
  });
  userInput.addEventListener('blur', () => {
    userInput.style.outline = '';
  });

  // Placeholder più descrittivo
  userInput.placeholder = "Scrivi la tua domanda o richiesta...";

  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click();
    }
  });

  // Mostra messaggio di benvenuto se la chat è già aperta (mobile)
  if (chatWindow.style.display !== "none") {
    showWelcome();
  }
});
