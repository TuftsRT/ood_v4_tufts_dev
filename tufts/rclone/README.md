## How To Use:
1. Clone this repo into your production apps (`ondemand/prod`).
2. Initialize the app and click 'launch'. 

Note: You can leave the 'Project' field blank unless you were given a specifc account name you’re allowed to use on the Pax cluster, e.g. a PI or group project code (often something like pzs0001 or whatever your cluster uses for “account”).

3. After the session is started, click on the link to the Session ID
4. Open `output.log` and copy the password.
5. Go back to your `batch_connect/sessions` page and click 'Connect to RClone Server'
6. When prompted, enter you cluster username and paste in the password you copied from `output.log`. 
7. Do the same for the RClone login.

To add **Google Drive** or **Box**, follow **Quick setup** below. You normally do **not** need to create your own apps in the Google or Box developer consoles.

---

## Development and forking

You can keep developing this app in a **new repository** (fork or fresh clone) if that fits your workflow. This tree is a starting point; nothing in Open OnDemand requires the app to live in a particular upstream repo. If you track changes from the [OSC RClone Server](https://github.com/OSC/bc_osc_rclone) or another base, merge or cherry-pick updates when you want upstream fixes.

---

## Prerequisites: Installing rclone on Your Local Machine

Before configuring Google Drive or Box Drive remotes, you need rclone installed on a machine with a web browser (typically your laptop or desktop computer).

### Quick Installation

**Linux/macOS/BSD:**
```bash
sudo -v ; curl https://rclone.org/install.sh | sudo bash
```

**macOS (using Homebrew):**
```bash
brew install rclone
```

**Linux (manual binary installation):**
```bash
curl -O https://downloads.rclone.org/rclone-current-linux-amd64.zip
unzip rclone-current-linux-amd64.zip
cd rclone-*-linux-amd64
sudo cp rclone /usr/bin/
sudo chown root:root /usr/bin/rclone
sudo chmod 755 /usr/bin/rclone
```

**Windows:**
Download the Windows binary from https://rclone.org/downloads/ and extract `rclone.exe`.

After installation, verify it works:
```bash
rclone version
```

---

## Quick setup: Google Drive and Box (default OAuth apps)

You **do not** need to visit the Google Cloud Console or Box Developer Console for basic use. rclone ships with built-in OAuth client credentials for [Google Drive](https://rclone.org/drive/#making-your-own-client-id) and [Box](https://rclone.org/box/#get-your-own-box-app-id). Leave **client ID** and **client secret** blank (press Enter) when `rclone config` asks for them.

**Why you might still create your own app:** shared defaults can hit rate limits; a personal or institutional OAuth app can perform better. See the optional sections below and the rclone docs.

**Browser vs headless:** For `Use web browser to automatically authenticate rclone with remote?`, answer **`y`** if the machine running `rclone config` has a browser you can use (for example a laptop with rclone). Answer **`n`** on the cluster and use `rclone authorize` from a machine with a browser (see the steps in each provider section). If you are unsure, try **`y`** first; if it fails, use **`n`** and follow [remote setup](https://rclone.org/remote_setup/).

**Box token lifetime:** Box refresh tokens stay valid on a **60-day rolling** basis as long as you use the remote within that window; see [rclone Box docs](https://rclone.org/box/#invalid-refresh-token).

---

## Configuring Google Drive

### Step 1: Configure rclone on the Cluster

**Important:** Creating a Google Drive remote **from inside the RClone web UI** often fails with 502 or CORS errors because the OAuth callback cannot reach the compute node. Follow these steps to configure it from the cluster command line instead.

1. **On the cluster** (OnDemand Shell or SSH), run:
   ```bash
   rclone config
   ```

2. **Create a new remote:**
   - When prompted `n/r/c/s/q>`, type `n` and press Enter
   - Enter a name for your remote (e.g., `gdrive`) and press Enter

3. **Select Google Drive:**
   - Type `drive` (or the number corresponding to Google Drive) and press Enter

4. **Client ID and Secret (defaults are fine):**
   - At `client_id>` and `client_secret>`, press **Enter** to use rclone’s built-in OAuth app, **or** paste credentials from your own Google Cloud OAuth client if you created one (optional section below).

5. **Select scope:**
   - At `scope>`, choose `1` (Full access all files, excluding Application Data Folder) and press Enter
   - This corresponds to the `drive` scope

6. **Service Account (skip):**
   - At `service_account_file>`, press Enter to leave blank (unless you're using a service account)

7. **Browser-based authentication:**
   - At `Use web browser to automatically authenticate rclone with remote?`, choose **`y`** if this session has a usable browser, or **`n`** for headless cluster setup (then continue with Step 2 below).
   - If you chose **`n`**, you will see `config_token>` — **do not enter anything yet** and keep this terminal open.

### Step 2: Get Authorization Token from Your Local Machine (if you chose `n` in Step 1)

Skip this if you already completed sign-in in the browser during Step 1.

1. **On your local machine** (with rclone installed and a web browser), run:
   ```bash
   rclone authorize "drive"
   ```

2. **Authorize rclone:**
   - Your browser should open automatically to a Google sign-in page
   - If it doesn't, copy the URL shown in the terminal (e.g., `http://127.0.0.1:53682/auth?state=...`)
   - Sign in with the Google account that has access to the Google Drive you want to use
   - Grant permissions to rclone
   - The terminal will display a token/code

3. **Copy the token:**
   - Copy the entire token string shown in the terminal (it will look like a long string of characters)

### Step 3: Complete Configuration on the Cluster

1. **Back in your cluster terminal** (where `rclone config` is waiting at `config_token>` if you used headless mode), paste the token you copied and press Enter. If you used browser auth in Step 1, follow the remaining prompts there.

2. **Configure Shared Drive (optional):**
   - If asked `Configure this as a Shared Drive (Team Drive)?`, type `n` and press Enter (unless you want to use a Team Drive)

3. **Confirm configuration:**
   - Review the configuration summary
   - When asked `y/e/d>`, type `y` and press Enter to save

4. **Quit config:**
   - Type `q` and press Enter to quit

Your Google Drive remote is now configured and saved to `~/.config/rclone/rclone.conf`.

### Step 4: Use Google Drive in the RClone Server App

1. Start (or reconnect to) the **RClone Server** app in OnDemand
2. Click "Connect to RClone Server"
3. Your configured Google Drive remote (e.g., `gdrive`) will appear in the web UI
4. You can now browse, upload, download, and manage files in your Google Drive through the web interface

### Optional: Create your own Google Drive OAuth client

**Why:** rclone’s default Google OAuth client is shared; [creating your own client ID](https://rclone.org/drive/#making-your-own-client-id) can improve throughput and avoid shared quota limits.

1. **Log into the Google API Console** with your Google account (any Google account; it doesn't need to match the Google Drive you want to access).

2. **Select a project or create a new project** from the project dropdown at the top.

3. **Enable the Google Drive API:**
   - Under "ENABLE APIS AND SERVICES", search for "Drive"
   - Enable the "Google Drive API"

4. **Configure the OAuth Consent Screen:**
   - Click "Credentials" in the left-side panel (not "Create credentials")
   - If you see "CONFIGURE CONSENT SCREEN" button (near the top right), click it, then click "Get started"
   - If you already configured an OAuth Consent Screen, skip to step 5
   - On the consent screen:
     - Enter an "Application name" (e.g., "rclone")
     - Enter "User Support Email" (your own email is fine)
     - Under Audience, select "External"
     - Enter your contact information, agree to terms, and click "Create"

5. **Add Required Scopes:**
   - Click "Data Access" on the left side panel
   - Click "add or remove scopes"
   - Select these scopes:
     - `https://www.googleapis.com/auth/docs`
     - `https://www.googleapis.com/auth/drive` (for editing, creating, and deleting files)
     - `https://www.googleapis.com/auth/drive.metadata.readonly` (optional but recommended)
   - Press "Update" or manually add them in the "Manually add scopes" text box (scroll down), enter: `https://www.googleapis.com/auth/docs,https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/drive.metadata.readonly`, press "add to table" then "update"
   - You should now see the three scopes on your Data access page
   - Press "Save" at the bottom

6. **Add Test Users:**
   - Click "Audience" on the left panel
   - Scroll down and click "+ Add users"
   - Add yourself as a test user
   - Press "Save"

7. **Create OAuth Client:**
   - Go to "Overview" on the left panel
   - Click "Create OAuth client"
   - Choose an application type of "Desktop app" and click "Create" (the default name is fine)
   - **Copy and save the Client ID and Client Secret** — use them when `rclone config` asks for `client_id` and `client_secret`.

8. **Publish the App (if using External audience):**
   - Go to "Audience" and click "PUBLISH APP" button
   - Confirm the action
   - **Note:** Google may show a warning about "enhanced security" and app verification. You can proceed without verification; you'll see a confirmation screen when connecting via browser, but this only happens during remote configuration.

---

## Configuring Box Drive

### Step 1: Configure rclone on the Cluster

**Important:** Creating a Box remote **from inside the RClone web UI** often fails with 502 or CORS errors because the OAuth callback cannot reach the compute node. Follow these steps to configure it from the cluster command line instead.

1. **On the cluster** (OnDemand Shell or SSH), run:
   ```bash
   rclone config
   ```

2. **Create a new remote:**
   - When prompted `n/s/q>`, type `n` and press Enter
   - Enter a name for your remote (e.g., `box`) and press Enter

3. **Select Box:**
   - Type `box` (or the number corresponding to Box) and press Enter

4. **Client ID and Secret (defaults are fine):**
   - At `client_id>` and `client_secret>`, press **Enter** to use rclone’s built-in Box app, **or** paste credentials from the Box Developer Console if you created your own app (optional section below).

5. **Leave other options blank:**
   - At `box_config_file>`, press Enter to leave blank
   - At `access_token>`, press Enter to leave blank

6. **Select Box sub-type:**
   - At `box_sub_type>`, choose `1` (Rclone should act on behalf of a user) and press Enter
   - This corresponds to `"user"` mode

7. **Browser-based authentication:**
   - At `Use web browser to automatically authenticate rclone with remote?`, choose **`y`** if this session has a usable browser, or **`n`** for headless cluster setup (then continue with Step 2 below).
   - If you chose **`n`**, you will see `config_token>` — **do not enter anything yet** and keep this terminal open.

### Step 2: Get Authorization Token from Your Local Machine (if you chose `n` in Step 1)

Skip this if you already completed sign-in in the browser during Step 1.

1. **On your local machine** (with rclone installed and a web browser), run:
   ```bash
   rclone authorize "box"
   ```

2. **Authorize rclone:**
   - Your browser should open automatically to a Box sign-in page
   - If it doesn't, copy the URL shown in the terminal (e.g., `http://127.0.0.1:53682/auth?state=...`)
   - Sign in with your Box account
   - Grant permissions to rclone
   - The terminal will display a token/code

3. **Copy the token:**
   - Copy the entire token string shown in the terminal (it will look like a long string of characters)

### Step 3: Complete Configuration on the Cluster

1. **Back in your cluster terminal** (where `rclone config` is waiting at `config_token>` if you used headless mode), paste the token you copied and press Enter. If you used browser auth in Step 1, follow the remaining prompts there.

2. **Confirm configuration:**
   - Review the configuration summary
   - When asked `y/e/d>`, type `y` and press Enter to save

3. **Quit config:**
   - Type `q` and press Enter to quit

Your Box remote is now configured and saved to `~/.config/rclone/rclone.conf`.

### Step 4: Use Box in the RClone Server App

1. Start (or reconnect to) the **RClone Server** app in OnDemand
2. Click "Connect to RClone Server"
3. Your configured Box remote (e.g., `box`) will appear in the web UI
4. You can now browse, upload, download, and manage files in your Box account through the web interface

### Optional: Create your own Box OAuth app

**Why:** rclone’s default Box credentials are shared; [your own Box app](https://rclone.org/box/#get-your-own-box-app-id) can perform better under load.

1. **Go to the Box Developer Console** and log in: https://developer.box.com/

2. **Create a new app:**
   - Click "My Apps" on the sidebar
   - Click "Create New App"
   - Select "Custom App"

3. **Configure the app:**
   - In the popup, enter an "App Name" (can be anything)
   - For "Purpose", choose "automation" (to avoid filling out additional fields)
   - Click "Next"

4. **Set authentication method:**
   - In the second screen, select "User Authentication (OAuth 2.0)"
   - Click "Create App"

5. **Get Client ID and Secret:**
   - You should now be on the "Configuration" tab (if not, click it at the top)
   - **Copy and save the Client ID and Client Secret** — use them when `rclone config` asks for `client_id` and `client_secret`.

6. **Configure Redirect URI:**
   - Under "OAuth 2.0 Redirect URI", add: `http://127.0.0.1:53682/`
   - Click "Save Changes" at the top right

7. **Set Application Scopes:**
   - Under "Application Scopes", select:
     - "Read all files and folders stored in Box"
     - "Write all files and folders stored in box" (if you want write access)
   - Leave other scopes unchecked
   - Click "Save Changes" at the top right

---

## Institutional OAuth (optional, for site administrators)

If your institution registers **one** Google Drive and/or Box OAuth application, you can avoid asking every user to create developer-console apps while still having each user complete their **own** login (tokens stay per user in `rclone.conf`).

**Environment variables:** rclone reads options from the environment using the pattern `RCLONE_CONFIG_<REMOTE_NAME>_<OPTION>` (see [rclone docs — config](https://rclone.org/docs/#config-file)); the remote name is **uppercased** in the variable (for example remote `gdrive` → `RCLONE_CONFIG_GDRIVE_*`). Examples:

- `RCLONE_CONFIG_GDRIVE_CLIENT_ID`
- `RCLONE_CONFIG_GDRIVE_CLIENT_SECRET`

The remote name must match the section name in `rclone.conf` (for example `[gdrive]`). Users still run `rclone config` to add the remote and complete OAuth; they can leave client ID/secret blank in the wizard if these variables are set in the job environment.

**This app:** `template/before.sh.erb` optionally sources, if present:

1. `~/.config/rclone/ood_oauth_env.sh` (per-user), or
2. `/etc/ood/config/apps/rclone/ood_oauth_env.sh` (site-wide)

Put `export` lines for the `RCLONE_CONFIG_*` variables in one of those files, or set the same variables in your batch scheduler / OnDemand job environment. Do not commit secrets into this git repository.

**Pre-populating `rclone.conf`:** You can ship a fragment with only `client_id` / `client_secret` (and `type`) for a fixed remote name, but **refresh tokens and access tokens are user-specific**. Fully copying one person’s config to another account will not work for OAuth. Pre-populating institutional client credentials via env vars or a shared template is the usual approach; each user still completes authentication once.

---

## Troubleshooting

### Config File Location

The rclone configuration file is stored at:
```bash
~/.config/rclone/rclone.conf
```

To verify the location, run:
```bash
rclone config file
```

### Using Remotes in the Web UI

After configuring remotes via the command line (as described above), they will automatically appear in the RClone Server web UI when you connect. You do **not** need to create them again in the browser.

### Alternative: Copy Config File from Desktop

If you already have rclone configured on your desktop/laptop machine, you can copy the config file to the cluster:

1. **On your desktop machine**, find the config file:
   ```bash
   rclone config file
   ```
   This will show the path (typically `~/.rclone.conf` or `~/.config/rclone/rclone.conf`)

2. **Transfer the file to the cluster** using `scp`, `sftp`, or any file transfer method:
   ```bash
   scp ~/.config/rclone/rclone.conf username@cluster:/home/username/.config/rclone/rclone.conf
   ```

3. **On the cluster**, verify the config:
   ```bash
   rclone config file
   ```

4. Start the RClone Server app - your remotes will be available in the web UI.

---

## Credits:
Thank you to the original [OSC RClone Server](https://github.com/OSC/bc_osc_rclone/pull/2/changes#diff-a7116dd89d33997536d45f8431adbca9fd731407e84271a3e98c8af08bf27acb) for the base of this app.
