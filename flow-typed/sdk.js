declare class AddonEventTarget {
  initialize(): void;
  on(type: string, listener: Function): AddonEventTarget;
  once(type: string, listener: Function): AddonEventTarget;
  removeListener(type?: string, listener?: Function): AddonEventTarget;
  off(type?: string, listener?: Function): AddonEventTarget;
}

declare class EventEmitter extends AddonEventTarget {
  emit(type: string, ...args: any): void;
}

declare class Worker extends AddonEventTarget {
  postMessage(data: number | string | Object): void;
  destroy(): void;
  port: EventEmitter,
  url: string,
  tab: ?Object
}

// NOTE: this module is not in the actual sdk
declare module 'sdk/event/emitter' {
  declare module.exports: {
    EventEmitter: typeof EventEmitter
  }
}

declare module 'sdk/system/unload' {
  declare function when(fn: Function): void
}

declare module 'sdk/l10n' {
  declare function get(...any): string
}

declare module 'sdk/self' {
  declare module.exports: {
    uri: string,
    id: string,
    name: string,
    version: string,
    loadReason: 'install' | 'enable' | 'startup' | 'upgrade' | 'downgrade',
    isPrivateBrowsingSupported: boolean,
    data: {
      load: (name: string) => string,
      url: (name: string) => string
    }
  }
}

declare module 'sdk/panel' {
  declare type PanelOptions = {
    width?: number,
    height?: number,
    position?: any,
    focus?: boolean,
    contentURL?: string,
    allow?: { script: boolean },
    contentScriptFile?: string | string[],
    contentScript?: string | string[],
    contentStyleFile?: string | string[],
    contentStyle?: string | string[],
    contentScriptWhen?: 'start' | 'ready' | 'end',
    contentScriptOptions?: any,
    contextMenu?: boolean,
    onMessage?: Function,
    onShow?: Function,
    onHide?: Function
  };

  declare class Panel mixins AddonEventTarget {
    constructor(options?: PanelOptions): void;
    destroy(): void;
    postMessage(message: any): void;
    show(options?: {
      width?: number,
      height?: number,
      position?: any,
      focus?: boolean
    }): void;
    hide(): void;
    resize(width: number, height: number): void;
    port: EventEmitter;
    isShowing: boolean;
    height: number;
    width: number;
    focus: boolean;
    contentURL: string;
    allow: { script: boolean };
    contentScriptFile: string | string[];
    contentScript: string | string[];
    contentScriptWhen: 'start' | 'ready' | 'end';
    contentScriptOptions: any;
  }
  declare module.exports: {
    Panel: typeof Panel
  }
}

declare module 'sdk/tabs' {
  declare class Tab mixins AddonEventTarget {
    pin(): void;
    unpin(): void;
    close(callback: Function): void;
    reload(): void;
    activate(): void;
    attach(options?: {
      contentScriptFile?: string | string[],
      contentScript?: string | string[],
      contentScriptOptions?: any,
      onMessage?: Function,
      onError?: Function
    }): EventEmitter; // TODO Worker
    id: string;
    title: string;
    url: string;
    favicon: string;
    contentType: string;
    index: number;
    isPinned: boolean;
    window: Object; // TODO
    readyState: 'uninitialized' | 'loading' | 'interactive' | 'complete';
  }
  declare class Tabs mixins AddonEventTarget {
    open: (options: string | {
      url: string,
      isPrivate?: boolean,
      isNewWindow?: boolean,
      inBackground?: boolean,
      isPinned?: boolean,
      onOpen?: Function,
      onClose?: Function,
      onReady?: Function,
      onLoad?: Function,
      onPageShow?: Function,
      onActivate?: Function,
      onDeactivate?: Function
    }) => void,
    activeTab: Tab,
    length: number
  }
  declare module.exports: Tabs
}

declare module 'sdk/timers' {
  declare function setTimeout(callback: Function, ms?: number): number;
  declare function clearTimeout(id: ?number): void;
  declare function setInterval(callback: Function, ms?: number): number;
  declare function clearInterval(id: ?number): void;
}

declare module 'sdk/ui/button/action' {
  declare type Properties = {
    id: string,
    label: string,
    icon: string | Object,
    disabled: boolean,
    checked: boolean,
    badge: ?string | number,
    badgeColor: string
  };
  declare class ActionButton mixins AddonEventTarget {
    constructor(options: {
      id: string,
      label: string,
      icon: string | Object,
      disabled?: boolean,
      onChange?: (state: Properties) => any,
      onClick?: Function,
      badge?: ?string | number,
      badgeColor?: string
    }): void;
    click(): void;
    state(target: any, state?: any): any;
    destroy(): void;
    id: string;
    label: string;
    icon: string | Object;
    disabled: boolean;
    checked: boolean;
    badge: ?string | number;
    badgeColor: string;
  }
  declare module.exports: {
    ActionButton: typeof ActionButton
  }
}

declare module 'sdk/simple-storage' {
  declare class SimpleStorage mixins AddonEventTarget {
    storage: Object;
    quotaUsage: number;
  }
  declare module.exports: SimpleStorage
}

declare module 'sdk/querystring' {
  declare function stringify(fields: Object, separator?: string, assignment?: string): string;
  declare function parse(querystring: string, separator?: string, assignment?: string): Object;
  declare function escape(query: string): string;
  declare function unescape(query: string): string;
}

declare module 'sdk/request' {
  declare class Response {
    url: string;
    text: string;
    json: any;
    status: number;
    statusText: string;
    headers: Object;
    anonymous: boolean;
  }
  declare class Request mixins AddonEventTarget {
    constructor(options?: {
      url?: string,
      onComplete?: Function,
      headers?: Object,
      content?: string | Object,
      contentType?: string,
      overrideMimeType?: string,
      anonymous?: boolean
    }): void;
    get(): Request;
    head(): Request;
    post(): Request;
    put(): Request;
    delete(): Request;
    url: string;
    headers: Object;
    content: string | Object;
    contentType: string;
    response: Response;
  }
  declare module.exports: {
    Request: typeof Request
  }
}

declare module 'resource://gre/modules/AddonManager.jsm' {
  declare type AddonListener = any;
  declare type Addon = {
    isCompatibleWith: () => void,
    findUpdates: () => void,
    uninstall: () => void,
    hasResource: (path: string) => boolean,
    getResourceURI: (path: string) => any,
    getDataDirectory: (callback: Function) => void,
    appDisabled: boolean,
    blocklistState: number,
    creator: any,
    foreignInstall: boolean,
    id: string,
    isActive: boolean,
    isCompatible: boolean,
    isPlatformCompatible: boolean,
    name: string,
    pendingOperations: number,
    permissions: number,
    providesUpdatesSecurely: boolean,
    scope: number,
    type: string,
    userDisabled: boolean,
    version: string,
    installDate: Date
  };
  declare type AddonInstall = {
    install: () => void,
    cancel: () => void,
    addListener: (listener: Object) => void,
    removeListener: (listener: Object) => void,
    name: string,
    version: string,
    iconURL: string,
    releaseNotesURI: any,
    type: string,
    state: number,
    error: number,
    sourceURI: any,
    file: any,
    progress: number,
    maxProgress: number,
    certificate: any,
    certName: string,
    existingAddon: any,
    addon: any
  };
  declare class AddonManager {
    addAddonListener(listener: AddonListener): void;
    removeAddonListener(listener: AddonListener): void;
    getAllAddons(callback: (addons: Array<Addon>) => any): void;
    getAddonByID(id: string, addonCallback: (addon: Addon) => any): void;
    getInstallForURL(url: string, callback: (install: AddonInstall) => any, mimetype: string, ...rest: any): void;
    PENDING_ENABLE: number;
    // TODO rest
  }
  declare module.exports: {
    AddonManager: AddonManager;
  }
}

declare module 'sdk/util/uuid' {
  declare function uuid(stringId?: string): string; // TODO doesn't cover the parse case return type
}

declare module 'sdk/preferences/service' {
  declare function set(name: string, value: string | number | boolean): void;
  declare function get(name: string, defaultValue?: string | number | boolean): string | number | boolean;
  declare function has(name: string): boolean;
  declare function keys(root: string): string[];
  declare function isSet(name: string): boolean;
  declare function reset(name: string): void;
  declare function getLocalized(name: string, defaultValue?: string): string;
  declare function setLocalized(name: string, value: string): void;
}

declare module 'sdk/preferences/event-target' {
  declare class PrefsTarget mixins AddonEventTarget {
    constructor(options?: { branchName?: string }): void;
  }
}

declare module 'sdk/notifications' {
  declare module.exports: {
    notify(options: {
      title?: string,
      text?: string,
      iconURL?: string,
      onClick?: Function,
      data?: string
    }): void
  }
}

declare module 'sdk/page-mod' {
  declare class PageMod mixins AddonEventTarget {
    constructor(options: {
      include: string | RegExp | string[] | Array<RegExp>,
      contentScriptFile?: string | string[],
      contentScript?: string | string[],
      contentScriptWhen?: string,
      contentScriptOptions?: any,
      contentStyleFile?: string | string[],
      contentStyle?: string | string[],
      attachTo?: string | string[],
      onAttach?: (worker: Worker) => any,
      exclude?: string | RegExp | string[] | Array<RegExp>
    }): void;
    destroy(): void;
    include: string[];
  }
}

declare module 'sdk/system/events' {
  declare function emit(type: string, event?: Object): void;
  declare function on(type: string, listener: Function, strong?: boolean): void;
  declare function once(type: string, listener: Function, strong?: boolean): void;
  declare function off(type: string, listener?: Function): void;
}

declare module 'chrome' {
  declare module.exports: any
}

declare module 'sdk/core/disposable' {
  declare module.exports: any
}

declare module 'resource://gre/modules/Extension.jsm' {
  declare module.exports: {
    getExtensionUUID(id: string): string
  }
}

declare module 'resource://gre/modules/Services.jsm' {
  declare module.exports: {
    Services: {
      androidBridge: any,
      appinfo: any,
      appShell: any,
      blocklist: any,
      cache: any,
      cache2: any,
      clipboard: any,
      console: any,
      contentPrefs: any,
      cookies: any,
      cpmm: any,
      crashmanager: any,
      dirsvc: any,
      domStorageManager: any,
      DOMRequest: any,
      downloads: any,
      droppedLinkHandler: any,
      els: any,
      eTLD: any,
      focus: any,
      io: any,
      locale: any,
      logins: any,
      metro: any,
      mm: any,
      obs: any,
      perms: any,
      ppmm: any,
      prefs: any,
      prompt: any,
      scriptloader: any,
      scriptSecurityManager: any,
      search: any,
      startup: any,
      storage: any,
      strings: any,
      sysinfo: any,
      telemetry: any,
      tm: any,
      uriFixup: any,
      urlFormatter: any,
      vc: any,
      wm: any,
      ww: any
    }
  }
}

declare module 'resource://gre/modules/TelemetryController.jsm' {
  declare module.exports: {
    TelemetryController: {
      Constants: Object,
      getCurrentPingData: any,
      // observe: (subject: string, topic: string, data: any) => any,
      submitExternalPing: (type: string, payload: Object, options?: {
        addClientId?: boolean,
        addEnvironment?: boolean,
        overrideEnvironment?: Object
      }) => Promise<string>
      // TODO
    }
  }
}

declare module 'resource://gre/modules/ClientID.jsm' {
  declare module.exports: {
    ClientID: any
  }
}
