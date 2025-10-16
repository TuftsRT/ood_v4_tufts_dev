// public/custom_scripts/user_stats.js
document.addEventListener("DOMContentLoaded", function () {
  const sessionDurationEl = document.getElementById("session-duration");
  const loginTime = new Date();

  // === Session Duration (always active) ===
  function updateSessionDuration() {
    const now = new Date();
    const diff = Math.floor((now - loginTime) / 1000);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    if (sessionDurationEl) {
      sessionDurationEl.textContent = `${h}h ${m}m ${s}s`;
    }
  }

  updateSessionDuration();
  setInterval(updateSessionDuration, 1000);

  // === Optional dynamic sections (disabled in dev) ===
  // Uncomment these blocks later when you have corresponding data files or APIs.

  /*
  async function updateActiveJobs() {
    const el = document.getElementById("active-jobs-count");
    if (!el) return;
    try {
      const resp = await fetch("/pun/dev/dashboard/motd/active_jobs.json", { cache: "no-cache" });
      if (resp.ok) {
        const data = await resp.json();
        el.textContent = data.active_jobs ?? "0";
      }
    } catch (err) {
      console.debug("Active jobs fetch skipped:", err);
    }
  }

  async function updateDiskUsage() {
    const el = document.getElementById("disk-usage");
    if (!el) return;
    try {
      const resp = await fetch("/pun/dev/dashboard/motd/disk_usage.json", { cache: "no-cache" });
      if (resp.ok) {
        const data = await resp.json();
        el.textContent = data.usage ?? "N/A";
      }
    } catch (err) {
      console.debug("Disk usage fetch skipped:", err);
    }
  }

  async function updateAccountBalance() {
    const el = document.getElementById("account-balance");
    if (!el) return;
    try {
      const resp = await fetch("/pun/dev/dashboard/motd/account_balance.json", { cache: "no-cache" });
      if (resp.ok) {
        const data = await resp.json();
        el.textContent = `$${data.balance ?? "N/A"}`;
      }
    } catch (err) {
      console.debug("Account balance fetch skipped:", err);
    }
  }

  async function updateLastLogin() {
    const el = document.getElementById("last-login");
    if (!el) return;
    try {
      const resp = await fetch("/pun/dev/dashboard/motd/last_login.json", { cache: "no-cache" });
      if (resp.ok) {
        const data = await resp.json();
        el.textContent = data.last_login ?? el.textContent;
      }
    } catch (err) {
      console.debug("Last login fetch skipped:", err);
    }
  }

  // Run periodically (enable once data endpoints exist)
  // updateActiveJobs();
  // updateDiskUsage();
  // updateAccountBalance();
  // updateLastLogin();
  // setInterval(updateActiveJobs, 60000);
  // setInterval(updateDiskUsage, 300000);
  // setInterval(updateAccountBalance, 600000);
  // setInterval(updateLastLogin, 300000);
  */
});
