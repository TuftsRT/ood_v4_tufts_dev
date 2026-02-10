## How To Use:
1. Clone this repo into your production apps (`ondemand/prod`).
2. Initialize the app and click 'launch'. 

Note: You can leave the 'Project' field blank unless you were given a specifc account name you’re allowed to use on the Pax cluster, e.g. a PI or group project code (often something like pzs0001 or whatever your cluster uses for “account”).

3. After the session is started, click on the link to the Session ID
4. Open `output.log` and copy the password.
5. Go back to your `batch_connect/sessions` page and click 'Connect to RClone Server'
6. When prompted, enter you cluster username and paste in the password you copied from `output.log`. 
7. Do the same for the RClone login. 

## Credits:
Thank you to the original [OSC RClone Server](https://github.com/OSC/bc_osc_rclone/pull/2/changes#diff-a7116dd89d33997536d45f8431adbca9fd731407e84271a3e98c8af08bf27acb) for the base of this app.