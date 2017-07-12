import { Localized } from 'fluent-react/compat';

export function findLocalizedById(wrapper, id) {
  return wrapper.findWhere(
    elem => elem.type() === Localized && elem.prop('id') === id
  );
}
