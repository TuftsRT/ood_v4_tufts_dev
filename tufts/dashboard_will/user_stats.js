// custom_scripts/user_stats.js
document.addEventListener("DOMContentLoaded", function () {
  const activeJobsElement = document.getElementById("active-jobs-count");
  const diskUsageElement = document.getElementById("disk-usage");
  const accountBalanceElement = document.getElementById("account-balance");
  const sessionDurationElement = document.getElementById("session-duration");
  const lastLoginElement = document.getElementById("last-login");

  // Store login time to calculate session duration
  const loginTime = new Date();

  /** Utility: Fetch JSON safely */
  async function fetchJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error(`Error fetching ${url}:`, err);
      return null;
    }
  }

  /** Update Active Jobs Count (via API endpoint if available) */
  async function updateActiveJobs() {
    // You can adapt this URL to match your cluster’s API or job listing route.
    const data = await fetchJSON("/pun/sys/dashboard/api/jobs?owner=me");
    if (data && activeJobsElement) {
      activeJobsElement.textContent = data.active_jobs ?? data.length ?? "0";
    }
  }

  /** Update Disk Usage (via static script or JSON feed) */
  async function updateDiskUsage() {
    // Example: a small script or endpoint writing to /motd/disk_usage.json
    const data = await fetchJSON("/pun/dev/dashboard/motd/disk_usage.json");
    if (data && diskUsageElement) {
      diskUsageElement.textContent = data.usage || "N/A";
    }
  }

  /** Update Account Balance (if supported) */
  async function updateAccountBalance() {
    const data = await fetchJSON("/pun/dev/dashboard/motd/account_balance.json");
    if (data && accountBalanceElement) {
      accountBalanceElement.textContent = `$${data.balance || "N/A"}`;
    }
  }

  /** Update Session Duration dynamically every second */
  function updateSessionDuration() {
    const now = new Date();
    const diffMs = now - loginTime;
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (sessionDurationElement) {
      sessionDurationElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }
  }

  /** Optionally update the last login dynamically from a file */
  async function updateLastLogin() {
    const data = await fetchJSON("/pun/dev/dashboard/motd/last_login.json");
    if (data && lastLoginElement) {
      lastLoginElement.textContent = data.last_login || lastLoginElement.textContent;
    }
  }

  // ---- Initialization ----
  updateActiveJobs();
  updateDiskUsage();
  updateAccountBalance();
  updateLastLogin();
  updateSessionDuration();

  // ---- Refresh intervals ----
  setInterval(updateActiveJobs, 60 * 1000); // every minute
  setInterval(updateDiskUsage, 5 * 60 * 1000); // every 5 minutes
  setInterval(updateAccountBalance, 10 * 60 * 1000); // every 10 minutes
  setInterval(updateSessionDuration, 1000); // every second
});
