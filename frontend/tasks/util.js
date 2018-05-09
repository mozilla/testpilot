const LOCALIZABLE_FIELDS = [
  "subtitle",
  "description",
  "warning",
  "introduction",
  "privacy_preamble",
  "measurements",
  "eol_warning",
  "pre_feedback_copy",
  "details.copy",
  "tour_steps.copy",
  "contributors.title",
  "contributors_extra",
  "legal_notice"
];

function isLocalizableField(pieces) {
  return LOCALIZABLE_FIELDS.includes(
    pieces.reduce((a, b) => /^[0-9]+$/.test(b) ? a : `${a}.${b}`)
  );
}

function l10nIdFormat(str) {
  const segment = String(str).replace(/[^A-Za-z0-9]+/g, "");
  return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
}

function l10nId(pieces) {
  pieces[0] = l10nIdFormat(pieces[0]);
  const stitched = pieces.reduce((a, b) => `${a}${l10nIdFormat(b)}`);
  return stitched.charAt(0).toLowerCase() + stitched.slice(1);
}

function lookup(obj, path) {
  const pieces = path.split(".");
  if (pieces.length > 1) {
    try {
      return lookup(obj[pieces[0]], pieces.slice(1).join("."));
    } catch (exc) {
      return null;
    }
  }
  return obj[pieces[0]] || null;
}

function experimentL10nId(experiment, pieces) {
  if (experiment.dev) { // For dev-only experiments, data-l10n-id=null is omitted from the DOM
    return null;
  }
  if (typeof pieces === "string") {
    pieces = [pieces];
  }
  const piecesOut = [];
  for (let i = 0; i < pieces.length; i++) {
    piecesOut.push(pieces[i]);
    const suffix = lookup(experiment, `${pieces.slice(0, i + 1).join(".")}_l10nsuffix`);
    if (suffix) {
      piecesOut.push(suffix);
    }
  }
  return l10nId([].concat([experiment.slug], piecesOut));
}

module.exports = {
  isLocalizableField: isLocalizableField,
  l10nIdFormat: l10nIdFormat,
  l10nId: l10nId,
  lookup: lookup,
  experimentL10nId: experimentL10nId
};
