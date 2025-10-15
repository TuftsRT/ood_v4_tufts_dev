// public/custom_scripts/user_stats.js
document.addEventListener("DOMContentLoaded", function () {
  const activeJobsEl = document.getElementById("active-jobs-count");
  const diskUsageEl = document.getElementById("disk-usage");
  const accountBalanceEl = document.getElementById("account-balance");
  const sessionDurationEl = document.getElementById("session-duration");
  const lastLoginEl = document.getElementById("last-login");

  // session start for duration
  const loginTime = new Date();

  // compute base path from current location and widget script path.
  // If the dashboard is served at /pun/dev/dashboard/ then basePath -> "/pun/dev/dashboard/"
  let basePath = window.location.pathname;
  if (!basePath.endsWith("/")) basePath += "/";

  async function safeFetchJson(path) {
    try {
      const url = new URL(path, window.location.origin + basePath).toString();
      const resp = await fetch(url, { cache: "no-cache" });
      if (!resp.ok) {
        // return { ok:false, status:resp.status } for caller to decide
        return { ok: false, status: resp.status };
      }
      const data = await resp.json();
      return { ok: true, data };
    } catch (err) {
      console.warn("fetch error:", err, path);
      return { ok: false, status: "network" };
    }
  }

  // Helper to safely set textContent only if element exists
  function setText(el, text) {
    if (!el) return;
    // preserve any inner markup if original content included HTML (rare)
    el.textContent = text;
  }

  async function updateActiveJobs() {
    // Try motd file first: public/motd/active_jobs.json
    const r = await safeFetchJson("motd/active_jobs.json");
    if (r.ok && r.data) {
      setText(activeJobsEl, r.data.active_jobs ?? r.data.count ?? r.data.length ?? "0");
      return;
    }

    // Fallback: don't change existing server-rendered count (keep what's in DOM)
    console.debug("active_jobs.json not found or failed:", r.status);
  }

  async function updateDiskUsage() {
    const r = await safeFetchJson("motd/disk_usage.json");
    if (r.ok && r.data) {
      setText(diskUsageEl, r.data.usage ?? r.data.text ?? "N/A");
      return;
    }
    console.debug("disk_usage.json not found or failed:", r.status);
  }

  async function updateAccountBalance() {
    const r = await safeFetchJson("motd/account_balance.json");
    if (r.ok && r.data) {
      // allow numeric or string
      const value = typeof r.data.balance !== "undefined" ? r.data.balance : r.data.text;
      setText(accountBalanceEl, (typeof value === "number") ? `$${value}` : (value ?? "N/A"));
      return;
    }
    console.debug("account_balance.json not found or failed:", r.status);
  }

  async function updateLastLogin() {
    const r = await safeFetchJson("motd/last_login.json");
    if (r.ok && r.data) {
      setText(lastLoginEl, r.data.last_login ?? r.data.text ?? lastLoginEl.textContent);
      return;
    }
    console.debug("last_login.json not found or failed:", r.status);
  }

  function updateSessionDuration() {
    const now = new Date();
    const diff = Math.floor((now - loginTime) / 1000);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    setText(sessionDurationEl, `${h}h ${m}m ${s}s`);
  }

  // initial run (these functions fall back if files aren't present)
  updateActiveJobs();
  updateDiskUsage();
  updateAccountBalance();
  updateLastLogin();
  updateSessionDuration();

  // intervals
  setInterval(updateActiveJobs, 60 * 1000);       // 1m
  setInterval(updateDiskUsage, 5 * 60 * 1000);    // 5m
  setInterval(updateAccountBalance, 10 * 60 * 1000); // 10m
  setInterval(updateLastLogin, 5 * 60 * 1000);    // 5m
  setInterval(updateSessionDuration, 1000);       // every second
});
