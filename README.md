# OpenGOAL Decky Plugin

TODO

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
