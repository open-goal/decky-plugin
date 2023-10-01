import os
import hashlib
import traceback
import json
import base64
import tarfile
import urllib.request
from helpers import get_ssl_context # type: ignore
import shutil
import subprocess

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code one directory up
# or add the `decky-loader/plugin` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky_plugin
from shutil import copyfile
from vdf import binary_dump, binary_load
from pathlib import Path

def get_steam_path():
    return Path(decky_plugin.DECKY_USER_HOME) / '.local' / 'share' / 'Steam'

def get_steam_userdata():
    return get_steam_path() / 'userdata'

def get_userdata_config(steam32):
    return get_steam_userdata() / steam32 / 'config'

class Plugin:
    async def create_shortcut(self, owner_id, game):
        try:
            decky_plugin.logger.info("creating shortcut for game: {}".format(game))
            shortcuts_vdf = get_userdata_config(owner_id) / 'shortcuts.vdf'
            decky_plugin.logger.info("loading file: {}".format(shortcuts_vdf))
            d = binary_load(open(shortcuts_vdf, "rb"))
            decky_plugin.logger.info("existing shortcuts: {}".format(json.dumps(d["shortcuts"])))
            if game == "jak1":
                if "opengoal-jak1" not in d["shortcuts"]:
                    app_id = (int(hashlib.sha256("/home/deck/OpenGOAL/games/jak1/gk".encode()).hexdigest(), 16) % 1_000_000_000) * -1
                    d["shortcuts"]["opengoal-jak1"] = {
                        "appid": app_id,
                        "AppName": "OpenGOAL - Jak 1",
                        "Exe": "/home/deck/OpenGOAL/games/jak1/gk",
                        "StartDir": "/home/deck/OpenGOAL/games/jak1",
                        "icon": os.path.join(decky_plugin.DECKY_PLUGIN_DIR, "img", "jak1", "icon.png"),
                        "AllowOverlay": 1,
                    }
                    binary_dump(d, open(shortcuts_vdf, 'wb'))
                    decky_plugin.logger.info("Created shortcut with appId: {}".format(app_id))
                    return app_id
            elif game == "jak2":
                if "opengoal-jak1" not in d["shortcuts"]:
                    app_id = (int(hashlib.sha256("/home/deck/OpenGOAL/games/jak2/gk".encode()).hexdigest(), 16) % 1_000_000_000) * -1
                    d["shortcuts"]["opengoal-jak1"] = {
                        "appid": app_id,
                        "AppName": "OpenGOAL - Jak 2",
                        "Exe": "/home/deck/OpenGOAL/games/jak2/gk",
                        "StartDir": "/home/deck/OpenGOAL/games/jak2",
                        "icon": os.path.join(decky_plugin.DECKY_PLUGIN_DIR, "img", "jak2", "icon.png"),
                        "AllowOverlay": 1,
                    }
                    binary_dump(d, open(shortcuts_vdf, 'wb'))
                    decky_plugin.logger.info("Created shortcut with appId: {}".format(app_id))
                    return app_id
            decky_plugin.logger.info("shortcut already created")
            return None
        except:
            decky_plugin.logger.error("[create_shortcut] An exception occurred: {}".format(traceback.format_exc()))
            return None

    async def read_small_image_as_base64(self, game):
        try:
            if game == "jak1":
                with open(os.path.join(decky_plugin.DECKY_PLUGIN_DIR, "img", "jak1", "small.png"), 'rb') as image_file:
                    return base64.b64encode(image_file.read()).decode('utf-8')
            elif game == "jak2":
                with open(os.path.join(decky_plugin.DECKY_PLUGIN_DIR, "img", "jak2", "small.png"), 'rb') as image_file:
                    return base64.b64encode(image_file.read()).decode('utf-8')
            return None
        except:
            decky_plugin.logger.error("[read_small_image_as_base64] An exception occurred: {}".format(traceback.format_exc()))
            return None

    async def read_wide_image_as_base64(self, game):
        try:
            if game == "jak1":
                with open(os.path.join(decky_plugin.DECKY_PLUGIN_DIR, "img", "jak1", "wide.png"), 'rb') as image_file:
                    return base64.b64encode(image_file.read()).decode('utf-8')
            elif game == "jak2":
                with open(os.path.join(decky_plugin.DECKY_PLUGIN_DIR, "img", "jak2", "wide.png"), 'rb') as image_file:
                    return base64.b64encode(image_file.read()).decode('utf-8')
            return None
        except:
            decky_plugin.logger.error("[read_wide_image_as_base64] An exception occurred: {}".format(traceback.format_exc()))
            return None

    async def read_logo_image_as_base64(self, game):
        try:
            if game == "jak1":
                with open(os.path.join(decky_plugin.DECKY_PLUGIN_DIR, "img", "jak1", "logo.png"), 'rb') as image_file:
                    return base64.b64encode(image_file.read()).decode('utf-8')
            elif game == "jak2":
                with open(os.path.join(decky_plugin.DECKY_PLUGIN_DIR, "img", "jak2", "logo.png"), 'rb') as image_file:
                    return base64.b64encode(image_file.read()).decode('utf-8')
            return None
        except:
            decky_plugin.logger.error("[read_logo_image_as_base64] An exception occurred: {}".format(traceback.format_exc()))
            return None

    async def read_hero_image_as_base64(self, game):
        try:
            if game == "jak1":
                with open(os.path.join(decky_plugin.DECKY_PLUGIN_DIR, "img", "jak1", "hero.png"), 'rb') as image_file:
                    return base64.b64encode(image_file.read()).decode('utf-8')
            elif game == "jak2":
                with open(os.path.join(decky_plugin.DECKY_PLUGIN_DIR, "img", "jak2", "hero.png"), 'rb') as image_file:
                    return base64.b64encode(image_file.read()).decode('utf-8')
            return None
        except:
            decky_plugin.logger.error("[read_hero_image_as_base64] An exception occurred: {}".format(traceback.format_exc()))
            return None

    async def is_game_installed(self, game):
        try:
            game_dir = os.path.join("/home/deck/OpenGOAL/games", game)
            if os.path.exists(game_dir) and len(os.listdir(game_dir)) > 0:
                return True
            return False
        except:
            decky_plugin.logger.error("[is_game_installed] An exception occurred: {}".format(traceback.format_exc()))
            return False

    async def does_iso_exist_for_installation(self, game):
        try:
            iso_path = os.path.join("/home/deck/OpenGOAL/isos", "{}.iso".format(game))
            if os.path.exists(iso_path):
                return True
            return False
        except:
            decky_plugin.logger.error("[is_game_installed] An exception occurred: {}".format(traceback.format_exc()))
            return False

    async def download_file(self, url='', output_dir='', file_name=''):
        decky_plugin.logger.debug({url, output_dir, file_name})
        try:
            if access(dirname(output_dir), W_OK):
                req = Request(url, headers={'User-Agent': 'decky-steamgriddb backend'})
                res = urlopen(req, context=get_ssl_context())
                if res.status == 200:
                    with open(Path(output_dir) / file_name, mode='wb') as f:
                        f.write(res.read())
                    return str(Path(output_dir) / file_name)
                return False
        except:
            return False

        return False

    async def install_game(self, game):
        try:
            decky_plugin.logger.info("installing game: {}".format(game))
            # GitHub repository information
            owner = "open-goal"
            repo = "jak-project"

            # Directory where you want to extract the files
            extract_directory = os.path.join("/home/deck/OpenGOAL/games", game)

            # Reset the directory
            if os.path.exists(extract_directory):
                shutil.rmtree(extract_directory)
            os.makedirs(extract_directory)

            # Get the latest release URL using GitHub API
            release_url = "https://api.github.com/repos/{}/{}/releases/latest".format(owner, repo)
            release_resp = urllib.request.urlopen(release_url, context=get_ssl_context())
            
            if release_resp.status == 200:
                release_info = json.loads(release_resp.read().decode("utf-8"))
                decky_plugin.logger.info("received response from github: {}".format(release_info))

                # Find the asset with the desired format (opengoal-linux-*.tar.gz)
                asset_to_download = None
                for asset in release_info["assets"]:
                    if "opengoal-linux-" in asset["name"] and asset["name"].endswith(".tar.gz"):
                        asset_to_download = asset
                        break

                if asset_to_download:
                    # Construct the download URL
                    asset_url = asset_to_download["browser_download_url"]

                    # Download the asset
                    asset_file = os.path.join(extract_directory, asset_to_download["name"])
                    asset_resp = urllib.request.urlopen(asset_url, context=get_ssl_context())
                    if asset_resp.status == 200:
                        with open(asset_file, mode='wb') as f:
                            f.write(asset_resp.read())

                    # Extract the downloaded .tar.gz file
                    with tarfile.open(asset_file, "r:gz") as tar:
                        tar.extractall(extract_directory)

                    decky_plugin.logger.info("Downloaded and extracted: {}".format(asset_file))

                    # Delete the downloaded .tar.gz file
                    os.remove(asset_file)
                    decky_plugin.logger.info("Deleted: {}".format(asset_file))

                    # Run the extractor to install the game
                    iso_path = os.path.join("/home/deck/OpenGOAL/isos", "{}.iso".format(game))
                    completed_process = subprocess.run(['./extractor', iso_path, '--extract', '--validate', '--decompile', '--compile'], cwd=extract_directory, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)

                    # Retrieve the exit status
                    return_code = completed_process.returncode

                    if return_code != 0:
                        decky_plugin.logger.error("Could not install successfully, status code: {}".format(return_code))
                        decky_plugin.logger.error("Logs: ERROR LOGS:\n{}\n\nSTDOUT:\n{}".format(completed_process.stderr, completed_process.stdout))
                    else:
                        # Delete directories that aren't needed after installation to free up space
                        if os.path.exists(os.path.join(extract_directory, "data", "decompiler_out")):
                            shutil.rmtree(os.path.join(extract_directory, "data", "decompiler_out"))
                        if os.path.exists(os.path.join(extract_directory, "data", "iso_data")):
                            shutil.rmtree(os.path.join(extract_directory, "data", "iso_data"))
                        return True
                else:
                    decky_plugin.logger.info("No matching asset found.")
            else:
                decky_plugin.logger.error("received unexpected status code from github: {}".format(release_resp.status))
            return None
        except Exception as error:
            decky_plugin.logger.error("[install_game] An exception occurred: {}".format(traceback.format_exc()))
            return None

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        decky_plugin.logger.info("OpenGOAL Loaded!")

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        decky_plugin.logger.info("OpenGOAL Unloaded!")
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        decky_plugin.logger.info("Ensuring OpenGOAL paths are created")
        if not os.path.exists(os.path.join(decky_plugin.DECKY_USER_HOME, "OpenGOAL", "isos")):
            os.makedirs(os.path.join(decky_plugin.DECKY_USER_HOME, "OpenGOAL", "isos"), exist_ok=True)
        if not os.path.exists(os.path.join(decky_plugin.DECKY_USER_HOME, "OpenGOAL", "games", "jak1")):
            os.makedirs(os.path.join(decky_plugin.DECKY_USER_HOME, "OpenGOAL", "games", "jak1"), exist_ok=True)
        if not os.path.exists(os.path.join(decky_plugin.DECKY_USER_HOME, "OpenGOAL", "games", "jak2")):
            os.makedirs(os.path.join(decky_plugin.DECKY_USER_HOME, "OpenGOAL", "games", "jak2"), exist_ok=True)
