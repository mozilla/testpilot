class InstallHistory {
  constructor(installations) {
    if (typeof window !== "undefined" && !window.localStorage.installations) {
      window.localStorage.setItem("installations", JSON.stringify(installations));
    }
  }

  setActive(id) {
    const installations = JSON.parse(window.localStorage.installations);
    installations[id] = {
      active: true,
      addon_id: id,
      installDate: new Date().toISOString()
    };
    window.localStorage.setItem("installations", JSON.stringify(installations));
  }

  setInactive(id) {
    const installations = JSON.parse(window.localStorage.installations);
    installations[id] = {
      active: false,
      addon_id: id,
      uninstallDate: new Date().toISOString()
    };
    window.localStorage.setItem("installations", JSON.stringify(installations));
  }
}

export { InstallHistory as default };
