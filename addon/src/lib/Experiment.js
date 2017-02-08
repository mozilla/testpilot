/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

/* eslint-disable */

// @flow

function toAbsoluteUrl(baseUrl, path) {
  if (!path) {
    return '';
  }
  return path[0] === '/' ? baseUrl + path : path;
}

export class Notification {
  id: number;
  title: string;
  text: string;
  notify_after: string;
  constructor(object: Object) {
    this.id = object.id;
    this.title = object.title;
    this.text = object.text;
    this.notify_after = object.notify_after;
  }
}

export class Experiment {
  baseUrl: string;
  id: string;
  addon_id: string;
  title: string;
  thumbnail: string;
  version: string;
  xpi_url: string;
  html_url: string;
  survey_url: string;
  notifications: Array<Notification>;
  created: string;
  modified: string;
  completed: string;
  uninstalled: string;
  active: boolean;
  installDate: ?Date;
  launchDate: Date;
  localeGrantlist: Array<string>;
  localeBlocklist: Array<string>;
  constructor(object: Object, baseUrl?: string) {
    this.baseUrl = object.baseUrl || baseUrl || '';
    this.id = object.addon_id;
    this.addon_id = object.addon_id;
    this.title = object.title;
    this.thumbnail = toAbsoluteUrl(this.baseUrl, object.thumbnail);
    this.version = object.version;
    this.xpi_url = toAbsoluteUrl(this.baseUrl, object.xpi_url);
    this.html_url = toAbsoluteUrl(this.baseUrl, object.html_url);
    this.survey_url = toAbsoluteUrl(this.baseUrl, object.survey_url);
    this.notifications = Array.isArray(object.notifications)
      ? object.notifications.map(o => new Notification(o))
      : [];
    this.created = object.created;
    this.modified = object.modified;
    this.completed = object.completed;
    this.uninstalled = object.uninstalled;

    this.active = object.active || false;
    this.installDate = object.installDate;
    this.launchDate = object.launch_date
      ? new Date(object.launchDate)
      : new Date(object.created);

    this.localeGrantlist = object.locale_grantlist || [];
    this.localeBlocklist = object.locale_blocklist || [];
  }

  allowsLocale(locale: string) {
    const lang = locale.split('-')[0];
    if (this.localeGrantlist.length) {
      return this.localeGrantlist.includes(lang);
    } else if (this.localeBlocklist.length) {
      return !this.localeBlocklist.includes(lang);
    }
    return true;
  }

  toJSON() {
    return {
      addon_id: this.addon_id,
      title: this.title,
      thumbnail: this.thumbnail,
      html_url: this.html_url,
      created: this.created,
      modified: this.modified,
      completed: this.completed,
      active: this.active,
      installDate: this.installDate
    };
  }
}

export type Experiments = { [id: string]: Experiment };
