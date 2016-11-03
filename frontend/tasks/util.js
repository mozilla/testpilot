const LOCALIZABLE_FIELDS = [
  'subtitle',
  'description',
  'introduction',
  'measurements',
  'pre_feedback_copy',
  'details.copy',
  'tour_steps.copy',
  'contributors.title'
];

function isLocalizableField(pieces) {
  return LOCALIZABLE_FIELDS.includes(
    pieces.reduce((a, b) => /^[0-9]+$/.test(b) ? a : `${a}.${b}`)
  );
}

function l10nIdFormat(str) {
  const segment = String(str).replace(/[^A-Za-z0-9]+/g, '');
  return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
}

function l10nId(pieces) {
  pieces[0] = l10nIdFormat(pieces[0]);
  const stitched = pieces.reduce((a, b) => `${a}${l10nIdFormat(b)}`);
  return stitched.charAt(0).toLowerCase() + stitched.slice(1);
}

function lookup(obj, path) {
  const pieces = path.split('.');
  if (pieces.length > 1) {
    try {
      return lookup(obj[pieces[0]], pieces.slice(1).join('.'));
    } catch(exc) {
      return null;
    }
  }
  return obj[pieces[0]] || null;
}

function experimentL10nId(experiment, pieces) {
  if (typeof pieces === 'string') {
    pieces = [pieces];
  }
  const suffix = lookup(experiment, `${pieces.join('.')}_l10nsuffix`);
  if (suffix) {
    pieces.push(suffix);
  }
  return l10nId([].concat([experiment.slug], pieces));
}

module.exports = {
  isLocalizableField: isLocalizableField,
  l10nIdFormat: l10nIdFormat,
  l10nId: l10nId,
  lookup: lookup,
  experimentL10nId: experimentL10nId
};
