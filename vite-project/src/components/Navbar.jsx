//imports
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "motion/react";
import { Icon } from "@iconify/react";

import { getNavbarData } from "../data/navbarData";

const settings = JSON.parse(localStorage.getItem("userAppliedSettings")) || {};

//component
export function Navbar() {
  //orientation-based styling
  const navbarData = getNavbarData();
  const {
    orientation,
    baseClasses,
    layoutClass,
    positionClass,
    iconOrder,
    iconImgs,
    rightClickMenuStyle,
  } = navbarData;

  const navClass = `${baseClasses} ${layoutClass} ${positionClass}`;

  //links data
  const links = Object.entries(iconOrder)
    .sort((a, b) => a[1] - b[1])
    .map(([name]) => ({
      name,
      isSpacer: name.startsWith("_spacer"),
      isText: name.startsWith("_text"),
      path:
        name.toLowerCase() === "home"
          ? "/"
          : name.toLowerCase() === "games"
          ? "/games"
          : name.toLowerCase() === "apps"
          ? "/apps"
          : name.toLowerCase() === "settings"
          ? "/settings"
          : "#", // fallback
    }));

  //animation autohide navbar
  const moveDistance = 48; //distance to move navbar offscreen
  const controls = useAnimation();
  const hideTimeout = useRef(null);

  const scheduleHideNavbar = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);

    const saved = JSON.parse(localStorage.getItem("userAppliedSettings")) || {};
    if (saved.autoHideNavbar) {
      hideTimeout.current = setTimeout(hideNavbar, 3000);
    }
  };

  const hideNavbar = () => {
    const { orientation } = getNavbarData();

    controls.start({
      x:
        orientation === "left"
          ? -moveDistance
          : orientation === "right"
          ? moveDistance
          : 0,
      y:
        orientation === "top"
          ? -moveDistance
          : orientation === "bottom"
          ? moveDistance
          : 0,
      transition: { type: "tween", duration: 0.3 },
    });
  };

  const showNavbar = () => {
    controls.start({
      x: 0,
      y: 0,
      transition: { type: "tween", duration: 0.3 },
    });

    scheduleHideNavbar();
  };

  useEffect(() => {
    // Reset controls on mount / orientation change
    controls.set({ x: 0, y: 0 });

    scheduleHideNavbar();

    const handleSettingsChange = scheduleHideNavbar;

    window.addEventListener("settingsChanged", handleSettingsChange);

    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      window.removeEventListener("settingsChanged", handleSettingsChange);
    };
  }, [orientation]);

  //time
  const [militaryTime, setMilitaryTime] = useState(
    settings.militaryTime || false
  );

  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !militaryTime,
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: !militaryTime,
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [militaryTime]);

  useEffect(() => {
    const handleSettingsChange = () => {
      const updated = JSON.parse(localStorage.getItem("userAppliedSettings"));
      setMilitaryTime(updated.militaryTime || false);
    };

    window.addEventListener("settingsChanged", handleSettingsChange);
    return () =>
      window.removeEventListener("settingsChanged", handleSettingsChange);
  }, []);

  // Right-click menu
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [menuVisible, setMenuVisible] = useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault(); // prevent normal right click menu
    setMenuPos({ x: e.clientX, y: e.clientY });
    setMenuVisible(true);
    //make navbar not vanishy
    showNavbar();
    clearTimeout(hideTimeout.current);
  };

  const handleClickOutside = () => {
    setMenuVisible(false);
    //restart hide timer
    hideTimeout.current = setTimeout(hideNavbar, 3000);
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  //render
  return (
    <>
      {/* actual navbar */}
      <motion.nav
        key={orientation}
        animate={controls}
        className={navClass}
        onContextMenu={handleContextMenu}
      >
        {links.map((link) => {
          if (link.isSpacer) {
            return <div key={link.name} className="grow" />;
          }
          if (link.isText) {
            return (
              <div
                key={link.name}
                className="p-3 select-none inline-flex flex-wrap justify-center"
              >
                {time.split(/[: ]/).map((part, idx) => (
                  <span key={idx} className="flex-none">
                    {part}
                    {idx < 2 ? ":" : ""}
                  </span>
                ))}
              </div>
            );
          }

          return (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center p-2"
            >
              <Link to={link.path}>
                <Icon
                  icon={iconImgs[link.name]}
                  className="w-8 h-8 text-(--color-icon)"
                />
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      {/* ghost hover zone for support */}
      <div
        onMouseEnter={showNavbar}
        className={`fixed ${layoutClass} ${positionClass} z-999 bg-transparent`}
      />
      {/* right click menu */}
      <AnimatePresence>
        {menuVisible && (
          <motion.div
            key="context-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`${rightClickMenuStyle}`}
            style={{ top: menuPos.y, left: menuPos.x }}
          >
            <div className="p-2 hover:bg-(--color-hover)/10 cursor-pointer">
              Option 1
            </div>
            <div className="p-2 hover:bg-(--color-hover)/10 cursor-pointer">
              Option 2
            </div>
            <div className="p-2 hover:bg-(--color-hover)/10 cursor-pointer">
              Option 3
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
