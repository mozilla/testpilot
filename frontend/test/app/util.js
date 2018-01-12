import { Localized } from "fluent-react/compat";
import LocalizedHtml from "../../src/app/components/LocalizedHtml";

export function findLocalizedById(wrapper, id) {
  return wrapper.findWhere(
    elem => elem.type() === Localized && elem.prop("id") === id
  );
}

export function findLocalizedHtmlById(wrapper, id) {
  return wrapper.findWhere(
    elem => elem.type() === LocalizedHtml && elem.prop("id") === id
  );
}
