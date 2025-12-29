# OpenGOAL Decky Plugin

## This plugin has been deprecated.  We now recommend using the official AppImage launcher on the steamdeck which should function in the same way as it does on desktop environments.

You can download it from the homepage here: https://www.opengoal.dev

And you can find documentation (including steamdeck specific instructions) here: https://opengoal.dev/docs/usage/installation/

## Development

You can only use the `decky` CLI on linux.

Run `./.vscode/setup.sh` to set things up the first time, you'll need `nodejs` 16+ and `pnpm`.

Run `./.vscode/build.sh` to build the zip file in `out/`

The easiest way to get it onto your Deck is to transfer it via SSH

On your steamdeck:
```
passwd
sudo systemctl start sshd
sudo systemctl enable sshd
```

You will connect to `deck@steamdeck` with the password you created.

Enable developer tools in Decky and select the file.
