document.addEventListener("DOMContentLoaded", () => {
  const messages = document.querySelectorAll(".motd-message");

  messages.forEach((msg) => {
    const btn = msg.querySelector(".motd-mark-read");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      msg.classList.toggle("collapsed");
    });

    // Allow clicking the message itself to re-expand
    msg.addEventListener("click", (e) => {
      if (msg.classList.contains("collapsed") && !e.target.classList.contains("motd-mark-read")) {
        msg.classList.remove("collapsed");
      }
    });
  });
});
