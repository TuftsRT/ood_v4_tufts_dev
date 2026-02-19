## How To Use:
1. Clone this repo into your production apps (`ondemand/prod`).
2. Initialize the app and click 'launch'. 

Note: You can leave the 'Project' field blank unless you were given a specifc account name you’re allowed to use on the Pax cluster, e.g. a PI or group project code (often something like pzs0001 or whatever your cluster uses for “account”).

3. After the session is started, click on the link to the Session ID
4. Open `output.log` and copy the password.
5. Go back to your `batch_connect/sessions` page and click 'Connect to RClone Server'
6. When prompted, enter you cluster username and paste in the password you copied from `output.log`. 
7. Do the same for the RClone login.

## Configuring Google Drive (avoiding 502 / CORS)

Creating a Google Drive remote **from inside the RClone web UI** often fails with 502 or CORS errors, because the OAuth callback cannot reach the compute node. Create the remote from the cluster once, then use the web UI to browse and transfer.

1. **From the cluster** (OnDemand Shell or SSH), run:
   ```bash
   rclone config
   ```
   Choose **n** (New remote), give a name (e.g. `gdrive`), and select **drive** as the type.

2. When asked **“Use web browser to automatically authenticate?”** choose **n** (No).

3. **On a machine with a browser** (e.g. your laptop, with rclone installed), run:
   ```bash
   rclone authorize "drive"
   ```
   Open the URL it prints, sign in to Google, and copy the token it displays.

4. **Back in the cluster shell**, paste that token at the `config_token>` prompt, then confirm and quit. The config is saved to `~/.config/rclone/rclone.conf`.

5. Start (or reconnect to) the RClone Server app. It uses the same config directory, so your `gdrive` remote will appear in the web UI and you can use it without creating it again in the browser.

## Credits:
Thank you to the original [OSC RClone Server](https://github.com/OSC/bc_osc_rclone/pull/2/changes#diff-a7116dd89d33997536d45f8431adbca9fd731407e84271a3e98c8af08bf27acb) for the base of this app.