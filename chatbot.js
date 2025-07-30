document.addEventListener("DOMContentLoaded", () => {
  const chatButton = document.getElementById("chatButton");
  const chatWindow = document.getElementById("chatWindow");
  const closeChat = document.getElementById("closeChat");
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");

  chatButton.onclick = () => {
    chatWindow.style.display = "flex";
    chatButton.style.display = "none";
    userInput.focus();
  };

  closeChat.onclick = () => {
    chatWindow.style.display = "none";
    chatButton.style.display = "block";
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
    } catch (error) {
      document.getElementById("waitingMsg").innerHTML =
        `<strong>Errore:</strong> impossibile rispondere ora.`;
      console.error(error);
    }
  };

  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click();
    }
  });
});
