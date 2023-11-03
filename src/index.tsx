import {
  definePlugin,
  DialogButton,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  Navigation,
  staticClasses,
  Field,
  Spinner,
  Focusable,
} from "decky-frontend-lib";
import { VFC, useEffect, useState } from "react";
import ProjectIcon from "./components/icons/ProjectIcon";
import { SiGithub, SiDiscord, SiCrowdin } from "react-icons/si";
import { MdDeleteForever } from "react-icons/md";
import { SlLink } from "react-icons/sl";

const navigateToUrl = (url: string) => {
  Navigation.CloseSideMenus();
  Navigation.NavigateToExternalWeb(url);
};

const getCurrentSteamUserId = (steam64 = false): string => {
  if (steam64) return window.App.m_CurrentUser.strSteamID;
  return BigInt.asUintN(
    32,
    BigInt(window.App.m_CurrentUser.strSteamID)
  ).toString();
};

import { showModal, ConfirmModal } from "decky-frontend-lib";

const restartSteam = () => {
  SteamClient.User.StartRestart();
};

const showRestartConfirm = () => {
  showModal(
    <ConfirmModal
      strTitle={"Restart Steam?"}
      strCancelButtonText={"Later"}
      strOKButtonText={"Restart Now"}
      strDescription={
        "Steam needs to be restarted for the changes to take effect."
      }
      onOK={restartSteam}
    />
  );
};

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const [componentLoaded, setComponentLoaded] = useState(false);
  const [usersHomeDir, setUsersHomeDir] = useState("/home/deck");
  const [jak1Installed, setJak1Installed] = useState(false);
  const [jak1ISOExists, setJak1ISOExists] = useState(false);
  const [jak1Installing, setJak1Installing] = useState(false);
  const [jak1OutOfDate, setJak1OutOfDate] = useState(false);
  const [jak1ShortcutAlreadyExists, setJak1ShortcutAlreadyExists] =
    useState(false);
  const [jak2Installed, setJak2Installed] = useState(false);
  const [jak2ISOExists, setJak2ISOExists] = useState(false);
  const [jak2Installing, setJak2Installing] = useState(false);
  const [jak2OutOfDate, setJak2OutOfDate] = useState(false);
  const [jak2ShortcutAlreadyExists, setJak2ShortcutAlreadyExists] =
    useState(false);

  useEffect(() => {
    async function loadDefaults() {
      const homeDir = (
        await serverAPI.callPluginMethod("get_users_home_dir", {})
      ).result;
      if (typeof homeDir === "string") {
        setUsersHomeDir(homeDir);
      }
      // Jak 1
      const isJak1Installed = (
        await serverAPI.callPluginMethod("is_game_installed", { game: "jak1" })
      ).result;
      window.console.log(`Jak 1 Installed?: ${isJak1Installed}`);
      setJak1Installed(!!isJak1Installed);
      const jak1IsoExists = (
        await serverAPI.callPluginMethod("does_iso_exist_for_installation", {
          game: "jak1",
        })
      ).result;
      window.console.log(`Jak 1 ISO Exists?: ${jak1IsoExists}`);
      setJak1ISOExists(!!jak1IsoExists);
      const jak1OutOfDate = (
        await serverAPI.callPluginMethod("is_game_out_of_date", {
          game: "jak1",
        })
      ).result;
      window.console.log(`Jak 1 outOfDate?: ${jak1OutOfDate}`);
      setJak1OutOfDate(!!jak1OutOfDate);
      const jak1ShortcutAlreadyExists = (
        await serverAPI.callPluginMethod("shortcut_already_created", {
          owner_id: getCurrentSteamUserId(),
          game: "jak1",
        })
      ).result;
      window.console.log(
        `Jak 1 shortcutAlreadyExists?: ${jak1ShortcutAlreadyExists}`
      );
      setJak1ShortcutAlreadyExists(!!jak1ShortcutAlreadyExists);

      // Jak 2
      const isJak2Installed = (
        await serverAPI.callPluginMethod("is_game_installed", { game: "jak2" })
      ).result;
      window.console.log(`Jak 2 Installed?: ${isJak2Installed}`);
      setJak2Installed(!!isJak2Installed);
      const jak2IsoExists = (
        await serverAPI.callPluginMethod("does_iso_exist_for_installation", {
          game: "jak2",
        })
      ).result;
      window.console.log(`Jak 2 ISO Exists?: ${jak2IsoExists}`);
      setJak2ISOExists(!!jak2IsoExists);
      const jak2OutOfDate = (
        await serverAPI.callPluginMethod("is_game_out_of_date", {
          game: "jak2",
        })
      ).result;
      window.console.log(`Jak 2 outOfDate?: ${jak2OutOfDate}`);
      setJak2OutOfDate(!!jak2OutOfDate);
      const jak2ShortcutAlreadyExists = (
        await serverAPI.callPluginMethod("shortcut_already_created", {
          owner_id: getCurrentSteamUserId(),
          game: "jak2",
        })
      ).result;
      window.console.log(
        `Jak 2 shortcutAlreadyExists?: ${jak2ShortcutAlreadyExists}`
      );
      setJak2ShortcutAlreadyExists(!!jak2ShortcutAlreadyExists);
      setComponentLoaded(true);
    }
    loadDefaults();
  }, []);

  const showConfirmDeletionModal = () => {
    showModal(
      <ConfirmModal
        strTitle={"Delete Jak 1?"}
        strCancelButtonText={"Cancel"}
        strOKButtonText={"Delete"}
        strDescription={"Are you sure you want to delete Jak 1?"}
        onOK={async () => {
          const success = (
            await serverAPI.callPluginMethod("remove_game", {
              game: "jak1",
            })
          ).result;
          if (success) {
            setJak1Installed(false);
          }
        }}
      />
    );
  };

  const jak1InstallationHelperText = () => {
    if (jak1Installed) {
      if (jak1OutOfDate) {
        return `${usersHomeDir}/OpenGOAL/games/jak1 is out of date!`;
      } else {
        return `Already installed in: ${usersHomeDir}/OpenGOAL/games/jak1`;
      }
    } else if (!jak1ISOExists) {
      return `${usersHomeDir}/OpenGOAL/isos/jak1.iso not found, can't install!`;
    } else {
      return `Installs Jak 1 using ${usersHomeDir}/OpenGOAL/isos/jak1.iso`;
    }
  };

  const jak1InstallButtonContent = () => {
    if (jak1Installing) {
      return <Spinner width={16} height={16}></Spinner>;
    } else {
      if (jak1OutOfDate) {
        return "Update Jak 1";
      }
      return "Install Jak 1";
    }
  };

  const jak2InstallationHelperText = () => {
    if (jak2Installed) {
      if (jak2OutOfDate) {
        return `${usersHomeDir}/OpenGOAL/games/jak2 is out of date!`;
      } else {
        return `Already installed in: ${usersHomeDir}/OpenGOAL/games/jak2`;
      }
    } else if (!jak2ISOExists) {
      return `${usersHomeDir}/OpenGOAL/isos/jak2.iso not found, can't install!`;
    } else {
      return `Installs Jak 2 using ${usersHomeDir}/OpenGOAL/isos/jak2.iso`;
    }
  };

  const jak2InstallButtonContent = () => {
    if (jak2Installing) {
      return <Spinner width={16} height={16}></Spinner>;
    } else {
      if (jak2OutOfDate) {
        return "Update Jak 2";
      }
      return "Install Jak 2";
    }
  };

  const loadedComponent = () => {
    return (
      <>
        <PanelSection title="Installation">
          <PanelSectionRow>
            <Field
              bottomSeparator="none"
              icon={null}
              label={null}
              childrenLayout={undefined}
              inlineWrap="keep-inline"
              padding="none"
              spacingBetweenLabelAndChild="none"
              childrenContainerWidth="max"
              description={jak1InstallationHelperText()}
            >
              <Focusable style={{ display: "flex" }}>
                <DialogButton
                  disabled={
                    jak1Installing ||
                    !jak1ISOExists ||
                    (jak1Installed && !jak1OutOfDate)
                  }
                  onClick={async () => {
                    if (jak1OutOfDate) {
                      setJak1Installing(true);
                      const success = (
                        await serverAPI.callPluginMethod("update_game", {
                          game: "jak1",
                        })
                      ).result;
                      setJak1Installing(false);
                      if (
                        success !== null &&
                        success !== undefined &&
                        success
                      ) {
                        setJak1Installed(true);
                        setJak1OutOfDate(false);
                      }
                    } else {
                      setJak1Installing(true);
                      const success = (
                        await serverAPI.callPluginMethod("install_game", {
                          game: "jak1",
                        })
                      ).result;
                      setJak1Installing(false);
                      if (
                        success !== null &&
                        success !== undefined &&
                        success
                      ) {
                        setJak1Installed(true);
                        setJak1OutOfDate(false);
                      }
                    }
                  }}
                >
                  {jak1InstallButtonContent()}
                </DialogButton>
                {jak1Installed ? (
                  <DialogButton
                    disabled={jak1Installing}
                    onClick={async () => {
                      showConfirmDeletionModal();
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px",
                      maxWidth: "40px",
                      minWidth: "auto",
                      marginLeft: ".5em",
                    }}
                  >
                    <MdDeleteForever fill="#ff0000" />
                  </DialogButton>
                ) : null}
              </Focusable>
            </Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field
              bottomSeparator="none"
              icon={null}
              label={null}
              childrenLayout={undefined}
              inlineWrap="keep-inline"
              padding="none"
              spacingBetweenLabelAndChild="none"
              childrenContainerWidth="max"
              description={jak2InstallationHelperText()}
            >
              <Focusable style={{ display: "flex" }}>
                <DialogButton
                  disabled={
                    jak2Installing ||
                    !jak2ISOExists ||
                    (jak2Installed && !jak2OutOfDate)
                  }
                  onClick={async () => {
                    if (jak2OutOfDate) {
                      setJak2Installing(true);
                      const success = (
                        await serverAPI.callPluginMethod("update_game", {
                          game: "jak2",
                        })
                      ).result;
                      setJak2Installing(false);
                      if (
                        success !== null &&
                        success !== undefined &&
                        success
                      ) {
                        setJak2Installed(true);
                        setJak2OutOfDate(false);
                      }
                    } else {
                      setJak2Installing(true);
                      const success = (
                        await serverAPI.callPluginMethod("install_game", {
                          game: "jak2",
                        })
                      ).result;
                      setJak2Installing(false);
                      if (
                        success !== null &&
                        success !== undefined &&
                        success
                      ) {
                        setJak2Installed(true);
                        setJak2OutOfDate(false);
                      }
                    }
                  }}
                >
                  {jak2InstallButtonContent()}
                </DialogButton>
                {jak2Installed ? (
                  <DialogButton
                    disabled={jak2Installing}
                    onClick={async () => {
                      showConfirmDeletionModal();
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px",
                      maxWidth: "40px",
                      minWidth: "auto",
                      marginLeft: ".5em",
                    }}
                  >
                    <MdDeleteForever fill="#ff0000" />
                  </DialogButton>
                ) : null}
              </Focusable>
            </Field>
          </PanelSectionRow>
        </PanelSection>
        <PanelSection title="Shortcut Maker">
          <PanelSectionRow>
            <Field
              childrenLayout="below"
              description={
                jak1ShortcutAlreadyExists
                  ? "Shortcut Already Exists"
                  : "Adds a shortcut to your Steam Library for Jak 1"
              }
            >
              <DialogButton
                disabled={jak1ShortcutAlreadyExists}
                onClick={async () => {
                  const appId = (
                    await serverAPI.callPluginMethod("create_shortcut", {
                      owner_id: getCurrentSteamUserId(),
                      game: "jak1",
                    })
                  ).result;
                  window.console.log(appId);
                  if (appId !== null && appId !== undefined) {
                    // Set small capsule
                    const smallImageData = (
                      await serverAPI.callPluginMethod(
                        "read_small_image_as_base64",
                        { game: "jak1" }
                      )
                    ).result;
                    if (
                      smallImageData !== null &&
                      smallImageData !== undefined
                    ) {
                      await SteamClient.Apps.SetCustomArtworkForApp(
                        appId,
                        smallImageData,
                        "png",
                        0
                      );
                    }
                    // Set wide capsule
                    const wideImageData = (
                      await serverAPI.callPluginMethod(
                        "read_wide_image_as_base64",
                        { game: "jak1" }
                      )
                    ).result;
                    if (wideImageData !== null && wideImageData !== undefined) {
                      await SteamClient.Apps.SetCustomArtworkForApp(
                        appId,
                        wideImageData,
                        "png",
                        3
                      );
                    }
                    // Set hero
                    const heroImageData = (
                      await serverAPI.callPluginMethod(
                        "read_hero_image_as_base64",
                        { game: "jak1" }
                      )
                    ).result;
                    if (heroImageData !== null && heroImageData !== undefined) {
                      await SteamClient.Apps.SetCustomArtworkForApp(
                        appId,
                        heroImageData,
                        "png",
                        1
                      );
                    }
                    // Set logo
                    const logoImageData = (
                      await serverAPI.callPluginMethod(
                        "read_logo_image_as_base64",
                        { game: "jak1" }
                      )
                    ).result;
                    if (logoImageData !== null && logoImageData !== undefined) {
                      await SteamClient.Apps.SetCustomArtworkForApp(
                        appId,
                        logoImageData,
                        "png",
                        2
                      );
                    }
                    // NOTE - icon is set in the shortcut!
                    showRestartConfirm();
                  }
                }}
              >
                Create Jak 1 Shortcut
              </DialogButton>
            </Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field
              childrenLayout="below"
              description={
                jak2ShortcutAlreadyExists
                  ? "Shortcut Already Exists"
                  : "Adds a shortcut to your Steam Library for Jak 2"
              }
            >
              <DialogButton
                disabled={jak2ShortcutAlreadyExists}
                onClick={async () => {
                  const appId = (
                    await serverAPI.callPluginMethod("create_shortcut", {
                      owner_id: getCurrentSteamUserId(),
                      game: "jak2",
                    })
                  ).result;
                  window.console.log(appId);
                  if (appId !== null && appId !== undefined) {
                    // Set small capsule
                    const smallImageData = (
                      await serverAPI.callPluginMethod(
                        "read_small_image_as_base64",
                        { game: "jak2" }
                      )
                    ).result;
                    if (
                      smallImageData !== null &&
                      smallImageData !== undefined
                    ) {
                      await SteamClient.Apps.SetCustomArtworkForApp(
                        appId,
                        smallImageData,
                        "png",
                        0
                      );
                    }
                    // Set wide capsule
                    const wideImageData = (
                      await serverAPI.callPluginMethod(
                        "read_wide_image_as_base64",
                        { game: "jak2" }
                      )
                    ).result;
                    if (wideImageData !== null && wideImageData !== undefined) {
                      await SteamClient.Apps.SetCustomArtworkForApp(
                        appId,
                        wideImageData,
                        "png",
                        3
                      );
                    }
                    // Set hero
                    const heroImageData = (
                      await serverAPI.callPluginMethod(
                        "read_hero_image_as_base64",
                        { game: "jak2" }
                      )
                    ).result;
                    if (heroImageData !== null && heroImageData !== undefined) {
                      await SteamClient.Apps.SetCustomArtworkForApp(
                        appId,
                        heroImageData,
                        "png",
                        1
                      );
                    }
                    // Set logo
                    const logoImageData = (
                      await serverAPI.callPluginMethod(
                        "read_logo_image_as_base64",
                        { game: "jak2" }
                      )
                    ).result;
                    if (logoImageData !== null && logoImageData !== undefined) {
                      await SteamClient.Apps.SetCustomArtworkForApp(
                        appId,
                        logoImageData,
                        "png",
                        2
                      );
                    }
                    // NOTE - icon is set in the shortcut!
                    showRestartConfirm();
                  }
                }}
              >
                Create Jak 2 Shortcut
              </DialogButton>
            </Field>
          </PanelSectionRow>
        </PanelSection>
        <PanelSection title="Links">
          <PanelSectionRow>
            <Field
              bottomSeparator="none"
              icon={null}
              label={null}
              childrenLayout={undefined}
              inlineWrap="keep-inline"
              padding="none"
              spacingBetweenLabelAndChild="none"
              childrenContainerWidth="max"
            >
              <Focusable style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    fontSize: "1.5em",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: ".5em",
                  }}
                >
                  {<SlLink fill="#f3b33f" />}
                </div>
                <DialogButton
                  onClick={() => navigateToUrl("https://opengoal.dev/")}
                  style={{
                    padding: "10px",
                    fontSize: "14px",
                  }}
                >
                  Our Website
                </DialogButton>
              </Focusable>
            </Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field
              bottomSeparator="none"
              icon={null}
              label={null}
              childrenLayout={undefined}
              inlineWrap="keep-inline"
              padding="none"
              spacingBetweenLabelAndChild="none"
              childrenContainerWidth="max"
            >
              <Focusable style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    fontSize: "1.5em",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: ".5em",
                  }}
                >
                  {<SiDiscord fill="#5865F2" />}
                </div>
                <DialogButton
                  onClick={() => navigateToUrl("https://discord.gg/VZbXMHXzWv")}
                  style={{
                    padding: "10px",
                    fontSize: "14px",
                  }}
                >
                  Discord
                </DialogButton>
              </Focusable>
            </Field>
          </PanelSectionRow>
          {/* TODO - make a project for the plugin! */}
          {/* <PanelSectionRow>
        <Field
          bottomSeparator="none"
          icon={null}
          label={null}
          childrenLayout={undefined}
          inlineWrap="keep-inline"
          padding="none"
          spacingBetweenLabelAndChild="none"
          childrenContainerWidth="max"
        >
          <Focusable style={{ display: 'flex' }}>
            <div
              style={{
                display: 'flex',
                fontSize: '1.5em',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '.5em',
              }}
            >
              {<SiCrowdin fill="#fff" />}
            </div>
            <DialogButton
              onClick={() => navigateToUrl("https://crowdin.com/project/opengoal")}
              style={{
                padding: '10px',
                fontSize: '14px',
              }}
            >
              Help Translate
            </DialogButton>
          </Focusable>
        </Field>
      </PanelSectionRow> */}
          <PanelSectionRow>
            <Field
              bottomSeparator="none"
              icon={null}
              label={null}
              childrenLayout={undefined}
              inlineWrap="keep-inline"
              padding="none"
              spacingBetweenLabelAndChild="none"
              childrenContainerWidth="max"
            >
              <Focusable style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    fontSize: "1.5em",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: ".5em",
                  }}
                >
                  {<SiGithub />}
                </div>
                <DialogButton
                  onClick={() => navigateToUrl("https://github.com/open-goal/")}
                  style={{
                    padding: "10px",
                    fontSize: "14px",
                  }}
                >
                  Github
                </DialogButton>
              </Focusable>
            </Field>
          </PanelSectionRow>
        </PanelSection>
      </>
    );
  };

  const loadingComponent = () => {
    return (
      <PanelSection title="Loading...">
        <p>
          If it remains loading for a while, this is a bug I've yet to figure
          out. You may have to restart your deck / re-open the plugin.
        </p>
      </PanelSection>
    );
  };

  return componentLoaded ? loadedComponent() : loadingComponent();
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>OpenGOAL</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <ProjectIcon />,
    onDismount() {
      serverApi.routerHook.removeRoute("/opengoal");
    },
  };
});
