document.addEventListener("DOMContentLoaded", () => {
  const messages = document.querySelectorAll(".motd-message");

  messages.forEach((msg) => {
    const btn = msg.querySelector(".motd-mark-read");
    const msgNumber = msg.dataset.messageNumber;

    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      collapseMessage(msg, msgNumber);
    });
  });

  function collapseMessage(msg, num) {
    // Hide full content
    msg.classList.add("collapsed");

    // Save original HTML so we can restore it later
    msg.dataset.originalContent = msg.innerHTML;

    // Replace with collapsed header
    msg.innerHTML = `
      <div class="motd-collapsed-header">
        Message ${num} <span class="motd-arrow">⯆</span>
      </div>
    `;

    // Add click listener to expand again
    msg.querySelector(".motd-collapsed-header").addEventListener("click", () => {
      expandMessage(msg);
    });
  }

  function expandMessage(msg) {
    msg.classList.remove("collapsed");
    msg.innerHTML = msg.dataset.originalContent;

    // Reattach the mark-as-read listener after restoring HTML
    const btn = msg.querySelector(".motd-mark-read");
    const msgNumber = msg.dataset.messageNumber;

    if (btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        collapseMessage(msg, msgNumber);
      });
    }
  }
});
