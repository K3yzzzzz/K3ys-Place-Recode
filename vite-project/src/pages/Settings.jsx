import { useState } from "react";
import { useNavigate } from "react-router-dom";

import reactImg from "../assets/react.svg";
import viteImg from "../assets/vite.svg";
import tailwindImg from "../assets/tailwindcss.svg";

import { dataThemeOptions } from "../data/themeOptions";

const DEFAULT_SETTINGS = {
  militaryTime: false,
  autoHideNavbar: false,
  navbarOrientation: "bottom",
  selectedTab: "general",
};

// make more secure later
const BlurredEmail = ({ email }) => {
  const [name, domain] = email.split("@");

  return (
    <span>
      <span className="blur-xs no-copy">{name}</span>
      <span>@{domain}</span>
    </span>
  );
};

const BlurredPassword = ({ length }) => {
  return <span className="blur-xs no-copy">{"a".repeat(length)}</span>;
};

export function Settings({ setLoggedIn }) {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("userAppliedSettings");
    return saved
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      : DEFAULT_SETTINGS;
  });

  const persistSettings = (updated) => {
    setSettings(updated);
    localStorage.setItem("userAppliedSettings", JSON.stringify(updated));
    window.dispatchEvent(new Event("settingsChanged"));
  };

  const handleCheckboxChange = (e) => {
    const updated = {
      ...settings,
      [e.target.name]: e.target.checked,
    };
    persistSettings(updated);
  };

  const handleRadioChange = (e) => {
    const updated = {
      ...settings,
      [e.target.name]: e.target.value,
    };
    persistSettings(updated);
  };

  const openOption = (tab) => {
    persistSettings({ ...settings, selectedTab: tab });
  };

  return (
    <div className="grid grid-cols-7 divide-x-3 divide-(--color-navbar) h-screen w-screen">
      <div className="col-span-1 p-3 flex flex-col gap-4 mt-10 mb-10">
        {/* Settings tabs */}
        {["general", "account", "themes"].map((tab) => (
          <label
            key={tab}
            className="flex items-center justify-center rounded-lg basis-10 cursor-pointer hover:bg-(--color-hover)/5"
          >
            <input
              type="radio"
              name="settings"
              className="peer hidden"
              checked={settings.selectedTab === tab}
              onChange={() => openOption(tab)}
            />
            <span className="flex items-center justify-center rounded-lg w-full h-full peer-checked:bg-(--color-hover)/10">
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
          </label>
        ))}

        {/* Credits */}
        <div className="basis-20 mt-auto justify-items-center">
          <p>Created by K3yz</p>
          <p className="mb-2">Built with</p>
          <div className="flex gap-2">
            <img src={reactImg} className="h-6 w-6" />
            <img src={viteImg} className="h-6 w-6" />
            <img src={tailwindImg} className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Settings content */}
      <div className="col-span-6">
        {settings.selectedTab === "general" && (
          <div className="p-10">
            <h1 className="text-3xl font-bold mb-4">General</h1>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="militaryTime"
                checked={settings.militaryTime}
                onChange={handleCheckboxChange}
              />
              Use Military Time (24-hour format)
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="autoHideNavbar"
                checked={settings.autoHideNavbar}
                onChange={handleCheckboxChange}
              />
              Auto hide Navbar
            </label>

            <div className="flex flex-col gap-2 mt-6">
              <span className="font-medium">Navbar Orientation</span>

              {["top", "bottom", "left", "right"].map((pos) => (
                <label key={pos} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="navbarOrientation"
                    value={pos}
                    checked={settings.navbarOrientation === pos}
                    onChange={handleRadioChange}
                  />
                  {pos.charAt(0).toUpperCase() + pos.slice(1)}
                </label>
              ))}
            </div>
          </div>
        )}
        {settings.selectedTab === "account" && (
          <div className="p-10">
            <h1 className="text-3xl font-bold mb-4">Account</h1>
            {/* use icon for email? */}
            <span>
              Email:{" "}
            </span> <BlurredEmail email="exampleuser@gmail.com" /> <br />
            <span>Password: </span> <BlurredPassword length={10} /> <br />
            <button
              className="btn red mt-5"
              onClick={() => {
                navigate("/");
                localStorage.setItem("loggedIn", "false");
                setLoggedIn(false);
                window.location.href = window.location.href;
              }}
            >
              Log Out
            </button>
          </div>
        )}
        {settings.selectedTab === "themes" && (
          <div className="p-10">
            <h1 className="text-3xl font-bold mb-4">Theme</h1>
            <div id="themeOptionContainer">
              {Object.values(dataThemeOptions).map((theme) => {
                if (theme.name === "custom") {
                  return (
                    <div
                      key={theme.name}
                      className="p-4 mb-4 rounded-lg cursor-pointer hover:bg-(--color-hover)/10 flex items-center gap-4"
                      onClick={() => {
                        console.log("work on this later");
                        document.documentElement.setAttribute(
                          "data-theme",
                          theme.name
                        );
                        localStorage.setItem("data-theme", theme.name);
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{
                          background:
                            "conic-gradient(from 0deg at 50% 50%, #FFB3BA, #FFDFBA, #FFFFBA, #BAFFC9, #BAE1FF, #D7BAFF, #FFB3BA)",
                          imageRendering: "auto",
                        }}
                      ></div>
                      <span>{theme.name}</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={theme.name}
                    className="p-4 mb-4 rounded-lg cursor-pointer hover:bg-(--color-hover)/10 flex items-center gap-4"
                    onClick={() => {
                      document.documentElement.setAttribute(
                        "data-theme",
                        theme.name
                      );
                      localStorage.setItem("data-theme", theme.name);
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: theme.bgColor }}
                    ></div>
                    <span>{theme.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
