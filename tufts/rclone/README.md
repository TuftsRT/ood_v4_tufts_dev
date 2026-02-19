## How To Use:
1. Clone this repo into your production apps (`ondemand/prod`).
2. Initialize the app and click 'launch'. 

Note: You can leave the 'Project' field blank unless you were given a specifc account name you’re allowed to use on the Pax cluster, e.g. a PI or group project code (often something like pzs0001 or whatever your cluster uses for “account”).

3. After the session is started, click on the link to the Session ID
4. Open `output.log` and copy the password.
5. Go back to your `batch_connect/sessions` page and click 'Connect to RClone Server'
6. When prompted, enter you cluster username and paste in the password you copied from `output.log`. 
7. Do the same for the RClone login.

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

## Configuring Google Drive

### Step 1: Create Your Own Google Drive Client ID and Secret

**Why create your own client ID?** The default rclone client ID is shared by all users and has rate limits. Using your own client ID improves performance and avoids quota issues.

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
   - **Copy and save the Client ID and Client Secret** - you'll need these in the next step

8. **Publish the App (if using External audience):**
   - Go to "Audience" and click "PUBLISH APP" button
   - Confirm the action
   - **Note:** Google may show a warning about "enhanced security" and app verification. You can proceed without verification; you'll see a confirmation screen when connecting via browser, but this only happens during remote configuration.

### Step 2: Configure rclone on the Cluster

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

4. **Enter your Client ID and Secret:**
   - At `client_id>`, paste your **Client ID** from Step 1 and press Enter
   - At `client_secret>`, paste your **Client Secret** from Step 1 and press Enter

5. **Select scope:**
   - At `scope>`, choose `1` (Full access all files, excluding Application Data Folder) and press Enter
   - This corresponds to the `drive` scope

6. **Service Account (skip):**
   - At `service_account_file>`, press Enter to leave blank (unless you're using a service account)

7. **Choose manual authentication:**
   - At `Use web browser to automatically authenticate rclone with remote?`, type `n` and press Enter
   - This is required because the cluster node doesn't have a browser accessible to you

8. **Get authorization token:**
   - You'll see a prompt: `config_token>`
   - **Do not enter anything yet** - keep this terminal open

### Step 3: Get Authorization Token from Your Local Machine

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

### Step 4: Complete Configuration on the Cluster

1. **Back in your cluster terminal** (where `rclone config` is waiting at `config_token>`), paste the token you copied and press Enter

2. **Configure Shared Drive (optional):**
   - If asked `Configure this as a Shared Drive (Team Drive)?`, type `n` and press Enter (unless you want to use a Team Drive)

3. **Confirm configuration:**
   - Review the configuration summary
   - When asked `y/e/d>`, type `y` and press Enter to save

4. **Quit config:**
   - Type `q` and press Enter to quit

Your Google Drive remote is now configured and saved to `~/.config/rclone/rclone.conf`.

### Step 5: Use Google Drive in the RClone Server App

1. Start (or reconnect to) the **RClone Server** app in OnDemand
2. Click "Connect to RClone Server"
3. Your configured Google Drive remote (e.g., `gdrive`) will appear in the web UI
4. You can now browse, upload, download, and manage files in your Google Drive through the web interface

---

## Configuring Box Drive

### Step 1: Create Your Own Box App ID and Secret

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
   - **Copy and save the Client ID and Client Secret** - you'll need these in the next step

6. **Configure Redirect URI:**
   - Under "OAuth 2.0 Redirect URI", add: `http://127.0.0.1:53682/`
   - Click "Save Changes" at the top right

7. **Set Application Scopes:**
   - Under "Application Scopes", select:
     - "Read all files and folders stored in Box"
     - "Write all files and folders stored in box" (if you want write access)
   - Leave other scopes unchecked
   - Click "Save Changes" at the top right

### Step 2: Configure rclone on the Cluster

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

4. **Enter your Client ID and Secret:**
   - At `client_id>`, paste your **Client ID** from Step 1 and press Enter
   - At `client_secret>`, paste your **Client Secret** from Step 1 and press Enter

5. **Leave other options blank:**
   - At `box_config_file>`, press Enter to leave blank
   - At `access_token>`, press Enter to leave blank

6. **Select Box sub-type:**
   - At `box_sub_type>`, choose `1` (Rclone should act on behalf of a user) and press Enter
   - This corresponds to `"user"` mode

7. **Choose manual authentication:**
   - At `Use web browser to automatically authenticate rclone with remote?`, type `n` and press Enter
   - This is required because the cluster node doesn't have a browser accessible to you

8. **Get authorization token:**
   - You'll see a prompt: `config_token>`
   - **Do not enter anything yet** - keep this terminal open

### Step 3: Get Authorization Token from Your Local Machine

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

### Step 4: Complete Configuration on the Cluster

1. **Back in your cluster terminal** (where `rclone config` is waiting at `config_token>`), paste the token you copied and press Enter

2. **Confirm configuration:**
   - Review the configuration summary
   - When asked `y/e/d>`, type `y` and press Enter to save

3. **Quit config:**
   - Type `q` and press Enter to quit

Your Box remote is now configured and saved to `~/.config/rclone/rclone.conf`.

### Step 5: Use Box in the RClone Server App

1. Start (or reconnect to) the **RClone Server** app in OnDemand
2. Click "Connect to RClone Server"
3. Your configured Box remote (e.g., `box`) will appear in the web UI
4. You can now browse, upload, download, and manage files in your Box account through the web interface

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
