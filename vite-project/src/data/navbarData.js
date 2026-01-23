//convert me to css when possible

const DEFAULT_ORIENTATION = "bottom";

function getSettings() {
  try {
    return JSON.parse(localStorage.getItem("userAppliedSettings")) || {};
  } catch {
    return {};
  }
}

export function getNavbarData() {
  const settings = getSettings();
  const orientation = settings.navbarOrientation || DEFAULT_ORIENTATION;

  const isVertical = orientation === "left" || orientation === "right";

  const positionClass =
    orientation === "top"
      ? "top-0 left-0"
      : orientation === "bottom"
      ? "bottom-0 left-0"
      : orientation === "left"
      ? "top-0 left-0"
      : "top-0 right-0";

  return {
    orientation,
    positionClass,

    layouts: {
      horizontal: "w-screen h-12 flex-row",
      vertical: "w-12 h-screen flex-col",
    },

    baseClasses:
      "fixed flex bg-[var(--color-navbar)] z-[1000] pointer-events-auto select-none shadow-lg",

    iconImgs: {
      Default: "ph:placeholder-bold",
      Home: "ph:placeholder-bold",
      Games: "ph:game-controller-bold",
      Apps: "mdi:apps",
      Settings: "ph:gear-bold",
    },

    iconOrder: {
      Home: 1,
      Games: 2,
      Apps: 3,
      _spacer_1: 3.5,
      Settings: 4,
      _text_Time: 5,
    },

    rightClickMenuStyle:
      "fixed bg-[var(--color-navbar-panel)] text-white p-2 rounded-md z-2000 min-w-[120px]",

    get layoutClass() {
      return isVertical ? this.layouts.vertical : this.layouts.horizontal;
    },
  };
}
