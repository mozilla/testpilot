/* fluent-web@0.1.0 */
/**
 * Below is a manually a list of likely subtags corresponding to Unicode
 * CLDR likelySubtags list.
 * This list is curated by the maintainers of Project Fluent and is
 * intended to be used in place of the full likelySubtags list in use cases
 * where full list cannot be (for example, due to the size).
 *
 * This version of the list is based on CLDR 30.0.3.
 */
const likelySubtagsMin = {
  'ar': 'ar-arab-eg',
  'az-arab': 'az-arab-ir',
  'az-ir': 'az-arab-ir',
  'be': 'be-cyrl-by',
  'da': 'da-latn-dk',
  'el': 'el-grek-gr',
  'en': 'en-latn-us',
  'fa': 'fa-arab-ir',
  'ja': 'ja-jpan-jp',
  'ko': 'ko-kore-kr',
  'pt': 'pt-latn-br',
  'sr': 'sr-cyrl-rs',
  'sr-ru': 'sr-latn-ru',
  'sv': 'sv-latn-se',
  'ta': 'ta-taml-in',
  'uk': 'uk-cyrl-ua',
  'zh': 'zh-hans-cn',
  'zh-gb': 'zh-hant-gb',
  'zh-us': 'zh-hant-us',
};

const regionMatchingLangs = [
  'az',
  'bg',
  'cs',
  'de',
  'es',
  'fi',
  'fr',
  'hu',
  'it',
  'lt',
  'lv',
  'nl',
  'pl',
  'ro',
  'ru',
];

function getLikelySubtagsMin(loc) {
  if (likelySubtagsMin.hasOwnProperty(loc)) {
    return new Locale(likelySubtagsMin[loc]);
  }
  const locale = new Locale(loc);
  if (regionMatchingLangs.includes(locale.language)) {
    locale.region = locale.language;
    locale.string = `${locale.language}-${locale.region}`;
    return locale;
  }
  return null;
}

/* eslint no-magic-numbers: 0 */

const languageCodeRe = '([a-z]{2,3}|\\*)';
const scriptCodeRe = '(?:-([a-z]{4}|\\*))';
const regionCodeRe = '(?:-([a-z]{2}|\\*))';
const variantCodeRe = '(?:-([a-z]{3}|\\*))';

/**
 * Regular expression splitting locale id into four pieces:
 *
 * Example: `en-Latn-US-mac`
 *
 * language: en
 * script:   Latn
 * region:   US
 * variant:  mac
 *
 * It can also accept a range `*` character on any position.
 */
const localeRe = new RegExp(
`^${languageCodeRe}${scriptCodeRe}?${regionCodeRe}?${variantCodeRe}?$`, 'i');

const localeParts = ['language', 'script', 'region', 'variant'];

class Locale {
  /**
   * Parses a locale id using the localeRe into an array with four elements.
   *
   * If the second argument `range` is set to true, it places range `*` char
   * in place of any missing piece.
   *
   * It also allows skipping the script section of the id, so `en-US` is
   * properly parsed as `en-*-US-*`.
   */
  constructor(locale, range = false) {
    const result = localeRe.exec(locale.replace(/_/g, '-'));
    if (!result) {
      return;
    }

    const missing = range ? '*' : undefined;

    const language = result[1] || missing;
    const script = result[2] || missing;
    const region = result[3] || missing;
    const variant = result[4] || missing;

    this.language = language;
    this.script = script;
    this.region = region;
    this.variant = variant;
    this.string = locale;
  }

  isEqual(locale) {
    return localeParts.every(part => this[part] === locale[part]);
  }

  matches(locale) {
    return localeParts.every(part => {
      return this[part] === '*' || locale[part] === '*' ||
        (this[part] === undefined && locale[part] === undefined) ||
        (this[part] !== undefined && locale[part] !== undefined &&
        this[part].toLowerCase() === locale[part].toLowerCase());
    });
  }

  setVariantRange() {
    this.variant = '*';
  }

  setRegionRange() {
    this.region = '*';
  }

  addLikelySubtags() {
    const newLocale = getLikelySubtagsMin(this.string.toLowerCase());

    if (newLocale) {
      localeParts.forEach(part => this[part] = newLocale[part]);
      this.string = newLocale.string;
      return true;
    }
    return false;
  }
}

/* eslint no-magic-numbers: 0 */

/**
 * Negotiates the languages between the list of requested locales against
 * a list of available locales.
 *
 * The algorithm is based on the BCP4647 3.3.2 Extended Filtering algorithm,
 * with several modifications:
 *
 *  1) available locales are treated as ranges
 *
 *    This change allows us to match a more specific request against
 *    more generic available locale.
 *
 *    For example, if the available locale list provides locale `en`,
 *    and the requested locale is `en-US`, we treat the available locale as
 *    a locale that matches all possible english requests.
 *
 *    This means that we expect available locale ID to be as precize as
 *    the matches they want to cover.
 *
 *    For example, if there is only `sr` available, it's ok to list
 *    it in available locales. But once the available locales has both,
 *    Cyrl and Latn variants, the locale IDs should be `sr-Cyrl` and `sr-Latn`
 *    to avoid any `sr-*` request to match against whole `sr` range.
 *
 *    What it does ([requested] * [available] = [supported]):
 *
 *    ['en-US'] * ['en'] = ['en']
 *
 *  2) likely subtags from LDML 4.3 Likely Subtags has been added
 *
 *    The most obvious likely subtag that can be computed is a duplication
 *    of the language field onto region field (`fr` => `fr-FR`).
 *
 *    On top of that, likely subtags may use a list of mappings, that
 *    allow the algorithm to handle non-obvious matches.
 *    For example, making sure that we match `en` to `en-US` or `sr` to
 *    `sr-Cyrl`, while `sr-RU` to `sr-Latn-RU`.
 *
 *    This list can be taken directly from CLDR Supplemental Data.
 *
 *    What it does ([requested] * [available] = [supported]):
 *
 *    ['fr'] * ['fr-FR'] = ['fr-FR']
 *    ['en'] * ['en-US'] = ['en-US']
 *    ['sr'] * ['sr-Latn', 'sr-Cyrl'] = ['sr-Cyrl']
 *
 *  3) variant/region range check has been added
 *
 *    Lastly, the last form of check is against the requested locale ID
 *    but with the variant/region field replaced with a `*` range.
 *
 *    The rationale here laid out in LDML 4.4 Language Matching:
 *      "(...) normally the fall-off between the user's languages is
 *      substantially greated than regional variants."
 *
 *    In other words, if we can't match for the given region, maybe
 *    we can match for the same language/script but other region, and
 *    it will in most cases be preferred over falling back on the next
 *    language.
 *
 *    What it does ([requested] * [available] = [supported]):
 *
 *    ['en-AU'] * ['en-US'] = ['en-US']
 *    ['sr-RU'] * ['sr-Latn-RO'] = ['sr-Latn-RO'] // sr-RU -> sr-Latn-RU
 *
 *    It works similarly to getParentLocales algo, except that we stop
 *    after matching against variant/region ranges and don't try to match
 *    ignoring script ranges. That means that `sr-Cyrl` will never match
 *    against `sr-Latn`.
 */
function filterMatches(
  requestedLocales, availableLocales, strategy
) {
  const supportedLocales = new Set();

  const availLocales =
    new Set(availableLocales.map(locale => new Locale(locale, true)));

  outer:
  for (const reqLocStr of requestedLocales) {
    const reqLocStrLC = reqLocStr.toLowerCase();
    const requestedLocale = new Locale(reqLocStrLC);

    if (requestedLocale.language === undefined) {
      continue;
    }

    // Attempt to make an exact match
    // Example: `en-US` === `en-US`
    for (const availableLocale of availableLocales) {
      if (reqLocStrLC === availableLocale.toLowerCase()) {
        supportedLocales.add(availableLocale);
        for (const loc of availLocales) {
          if (loc.isEqual(requestedLocale)) {
            availLocales.delete(loc);
            break;
          }
        }
        if (strategy === 'lookup') {
          return Array.from(supportedLocales);
        } else if (strategy === 'filtering') {
          continue;
        } else {
          continue outer;
        }
      }
    }


    // Attempt to match against the available range
    // This turns `en` into `en-*-*-*` and `en-US` into `en-*-US-*`
    // Example: ['en-US'] * ['en'] = ['en']
    for (const availableLocale of availLocales) {
      if (requestedLocale.matches(availableLocale)) {
        supportedLocales.add(availableLocale.string);
        availLocales.delete(availableLocale);
        if (strategy === 'lookup') {
          return Array.from(supportedLocales);
        } else if (strategy === 'filtering') {
          continue;
        } else {
          continue outer;
        }
      }
    }

    // Attempt to retrieve a maximal version of the requested locale ID
    // If data is available, it'll expand `en` into `en-Latn-US` and
    // `zh` into `zh-Hans-CN`.
    // Example: ['en'] * ['en-GB', 'en-US'] = ['en-US']
    if (requestedLocale.addLikelySubtags()) {
      for (const availableLocale of availLocales) {
        if (requestedLocale.matches(availableLocale)) {
          supportedLocales.add(availableLocale.string);
          availLocales.delete(availableLocale);
          if (strategy === 'lookup') {
            return Array.from(supportedLocales);
          } else if (strategy === 'filtering') {
            continue;
          } else {
            continue outer;
          }
        }
      }
    }

    // Attempt to look up for a different variant for the same locale ID
    // Example: ['en-US-mac'] * ['en-US-win'] = ['en-US-win']
    requestedLocale.setVariantRange();

    for (const availableLocale of availLocales) {
      if (requestedLocale.matches(availableLocale)) {
        supportedLocales.add(availableLocale.string);
        availLocales.delete(availableLocale);
        if (strategy === 'lookup') {
          return Array.from(supportedLocales);
        } else if (strategy === 'filtering') {
          continue;
        } else {
          continue outer;
        }
      }
    }

    // Attempt to look up for a different region for the same locale ID
    // Example: ['en-US'] * ['en-AU'] = ['en-AU']
    requestedLocale.setRegionRange();

    for (const availableLocale of availLocales) {
      if (requestedLocale.matches(availableLocale)) {
        supportedLocales.add(availableLocale.string);
        availLocales.delete(availableLocale);
        if (strategy === 'lookup') {
          return Array.from(supportedLocales);
        } else if (strategy === 'filtering') {
          continue;
        } else {
          continue outer;
        }
      }
    }
  }

  return Array.from(supportedLocales);
}

function GetOption(options, property, type, values, fallback) {
  let value = options[property];

  if (value !== undefined) {
    if (type === 'boolean') {
      value = new Boolean(value);
    } else if (type === 'string') {
      value = String(value);
    }

    if (values !== undefined && values.indexOf(value) === -1) {
      throw new Error('Invalid option value');
    }

    return value;
  }

  return fallback;
}

/**
 * Negotiates the languages between the list of requested locales against
 * a list of available locales.
 *
 * It accepts three arguments:
 *
 *   requestedLocales:
 *     an Array of strings with BCP47 locale IDs sorted
 *     according to user preferences.
 *
 *   availableLocales:
 *     an Array of strings with BCP47 locale IDs of locale for which
 *     resources are available. Unsorted.
 *
 *   options:
 *     An object with the following, optional keys:
 *
 *       strategy: 'filtering' (default) | 'matching' | 'lookup'
 *
 *       defaultLocale:
 *         a string with BCP47 locale ID to be used
 *         as a last resort locale.
 *
 *       likelySubtags:
 *         a key-value map of locale keys to their most expanded variants.
 *         For example:
 *           'en' -> 'en-Latn-US',
 *           'ru' -> 'ru-Cyrl-RU',
 *
 *
 * It returns an Array of strings with BCP47 locale IDs sorted according to the
 * user preferences.
 *
 * The exact list will be selected differently depending on the strategy:
 *
 *   'filtering': (default)
 *     In the filtering strategy, the algorithm will attempt to match
 *     as many keys in the available locales in order of the requested locales.
 *
 *   'matching':
 *     In the matching strategy, the algorithm will attempt to find the
 *     best possible match for each element of the requestedLocales list.
 *
 *   'lookup':
 *     In the lookup strategy, the algorithm will attempt to find a single
 *     best available locale based on the requested locales list.
 *
 *     This strategy requires defaultLocale option to be set.
 */
function negotiateLanguages(
  requestedLocales,
  availableLocales,
  options = {}
) {

  const defaultLocale = GetOption(options, 'defaultLocale', 'string');
  const likelySubtags = GetOption(
    options, 'likelySubtags', 'object', undefined);
  const strategy = GetOption(options, 'strategy', 'string',
    ['filtering', 'matching', 'lookup'], 'filtering');

  if (strategy === 'lookup' && !defaultLocale) {
    throw new Error('defaultLocale cannot be undefined for strategy `lookup`');
  }

  const resolvedReqLoc = Array.from(Object(requestedLocales)).map(loc => {
    return String(loc);
  });
  const resolvedAvailLoc = Array.from(Object(availableLocales)).map(loc => {
    return String(loc);
  });

  const supportedLocales = filterMatches(
    resolvedReqLoc,
    resolvedAvailLoc, strategy, likelySubtags
  );

  if (strategy === 'lookup') {
    if (supportedLocales.length === 0) {
      supportedLocales.push(defaultLocale);
    }
  } else if (defaultLocale && !supportedLocales.includes(defaultLocale)) {
    supportedLocales.push(defaultLocale);
  }
  return supportedLocales;
}

/*
 * @module fluent-langneg
 * @overview
 *
 * `fluent-langneg` provides language negotiation API that fits into
 * Project Fluent localization composition and fallbacking strategy.
 *
 */

/* global Intl */

/**
 * The `FluentType` class is the base of Fluent's type system.
 *
 * Fluent types wrap JavaScript values and store additional configuration for
 * them, which can then be used in the `toString` method together with a proper
 * `Intl` formatter.
 */
class FluentType {

  /**
   * Create an `FluentType` instance.
   *
   * @param   {Any}    value - JavaScript value to wrap.
   * @param   {Object} opts  - Configuration.
   * @returns {FluentType}
   */
  constructor(value, opts) {
    this.value = value;
    this.opts = opts;
  }

  /**
   * Unwrap the raw value stored by this `FluentType`.
   *
   * @returns {Any}
   */
  valueOf() {
    return this.value;
  }

  /**
   * Format this instance of `FluentType` to a string.
   *
   * Formatted values are suitable for use outside of the `FluentBundle`.
   * This method can use `Intl` formatters memoized by the `FluentBundle`
   * instance passed as an argument.
   *
   * @param   {FluentBundle} [bundle]
   * @returns {string}
   */
  toString() {
    throw new Error("Subclasses of FluentType must implement toString.");
  }
}

class FluentNone extends FluentType {
  toString() {
    return this.value || "???";
  }
}

class FluentNumber extends FluentType {
  constructor(value, opts) {
    super(parseFloat(value), opts);
  }

  toString(bundle) {
    try {
      const nf = bundle._memoizeIntlObject(
        Intl.NumberFormat, this.opts
      );
      return nf.format(this.value);
    } catch (e) {
      // XXX Report the error.
      return this.value;
    }
  }
}

class FluentDateTime extends FluentType {
  constructor(value, opts) {
    super(new Date(value), opts);
  }

  toString(bundle) {
    try {
      const dtf = bundle._memoizeIntlObject(
        Intl.DateTimeFormat, this.opts
      );
      return dtf.format(this.value);
    } catch (e) {
      // XXX Report the error.
      return this.value;
    }
  }
}

/**
 * @overview
 *
 * The FTL resolver ships with a number of functions built-in.
 *
 * Each function take two arguments:
 *   - args - an array of positional args
 *   - opts - an object of key-value args
 *
 * Arguments to functions are guaranteed to already be instances of
 * `FluentType`.  Functions must return `FluentType` objects as well.
 */

var builtins = {
  "NUMBER": ([arg], opts) =>
    new FluentNumber(arg.valueOf(), merge(arg.opts, opts)),
  "DATETIME": ([arg], opts) =>
    new FluentDateTime(arg.valueOf(), merge(arg.opts, opts)),
};

function merge(argopts, opts) {
  return Object.assign({}, argopts, values(opts));
}

function values(opts) {
  const unwrapped = {};
  for (const [name, opt] of Object.entries(opts)) {
    unwrapped[name] = opt.valueOf();
  }
  return unwrapped;
}

/* global Intl */

// Prevent expansion of too long placeables.
const MAX_PLACEABLE_LENGTH = 2500;

// Unicode bidi isolation characters.
const FSI = "\u2068";
const PDI = "\u2069";


// Helper: match a variant key to the given selector.
function match(bundle, selector, key) {
  if (key === selector) {
    // Both are strings.
    return true;
  }

  if (key instanceof FluentNumber
    && selector instanceof FluentNumber
    && key.value === selector.value) {
    return true;
  }

  if (selector instanceof FluentNumber && typeof key === "string") {
    let category = bundle
      ._memoizeIntlObject(Intl.PluralRules, selector.opts)
      .select(selector.value);
    if (key === category) {
      return true;
    }
  }

  return false;
}

// Helper: resolve the default variant from a list of variants.
function getDefault(env, variants, star) {
  if (variants[star]) {
    return Type(env, variants[star]);
  }

  const { errors } = env;
  errors.push(new RangeError("No default"));
  return new FluentNone();
}

// Helper: resolve arguments to a call expression.
function getArguments(env, args) {
  const positional = [];
  const named = {};

  if (args) {
    for (const arg of args) {
      if (arg.type === "narg") {
        named[arg.name] = Type(env, arg.value);
      } else {
        positional.push(Type(env, arg));
      }
    }
  }

  return [positional, named];
}

// Resolve an expression to a Fluent type.
function Type(env, expr) {
  // A fast-path for strings which are the most common case. Since they
  // natively have the `toString` method they can be used as if they were
  // a FluentType instance without incurring the cost of creating one.
  if (typeof expr === "string") {
    return env.bundle._transform(expr);
  }

  // A fast-path for `FluentNone` which doesn't require any additional logic.
  if (expr instanceof FluentNone) {
    return expr;
  }

  // The Runtime AST (Entries) encodes patterns (complex strings with
  // placeables) as Arrays.
  if (Array.isArray(expr)) {
    return Pattern(env, expr);
  }

  switch (expr.type) {
    case "str":
      return expr.value;
    case "num":
      return new FluentNumber(expr.value);
    case "var":
      return VariableReference(env, expr);
    case "term":
      return TermReference({...env, args: {}}, expr);
    case "ref":
      return expr.args
        ? FunctionReference(env, expr)
        : MessageReference(env, expr);
    case "select":
      return SelectExpression(env, expr);
    case undefined: {
      // If it's a node with a value, resolve the value.
      if (expr.value !== null && expr.value !== undefined) {
        return Type(env, expr.value);
      }

      const { errors } = env;
      errors.push(new RangeError("No value"));
      return new FluentNone();
    }
    default:
      return new FluentNone();
  }
}

// Resolve a reference to a variable.
function VariableReference(env, {name}) {
  const { args, errors } = env;

  if (!args || !args.hasOwnProperty(name)) {
    errors.push(new ReferenceError(`Unknown variable: ${name}`));
    return new FluentNone(`$${name}`);
  }

  const arg = args[name];

  // Return early if the argument already is an instance of FluentType.
  if (arg instanceof FluentType) {
    return arg;
  }

  // Convert the argument to a Fluent type.
  switch (typeof arg) {
    case "string":
      return arg;
    case "number":
      return new FluentNumber(arg);
    case "object":
      if (arg instanceof Date) {
        return new FluentDateTime(arg);
      }
    default:
      errors.push(
        new TypeError(`Unsupported variable type: ${name}, ${typeof arg}`)
      );
      return new FluentNone(`$${name}`);
  }
}

// Resolve a reference to another message.
function MessageReference(env, {name, attr}) {
  const {bundle, errors} = env;
  const message = bundle._messages.get(name);
  if (!message) {
    const err = new ReferenceError(`Unknown message: ${name}`);
    errors.push(err);
    return new FluentNone(name);
  }

  if (attr) {
    const attribute = message.attrs && message.attrs[attr];
    if (attribute) {
      return Type(env, attribute);
    }
    errors.push(new ReferenceError(`Unknown attribute: ${attr}`));
    return Type(env, message);
  }

  return Type(env, message);
}

// Resolve a call to a Term with key-value arguments.
function TermReference(env, {name, attr, selector, args}) {
  const {bundle, errors} = env;

  const id = `-${name}`;
  const term = bundle._terms.get(id);
  if (!term) {
    const err = new ReferenceError(`Unknown term: ${id}`);
    errors.push(err);
    return new FluentNone(id);
  }

  // Every TermReference has its own args.
  const [, keyargs] = getArguments(env, args);
  const local = {...env, args: keyargs};

  if (attr) {
    const attribute = term.attrs && term.attrs[attr];
    if (attribute) {
      return Type(local, attribute);
    }
    errors.push(new ReferenceError(`Unknown attribute: ${attr}`));
    return Type(local, term);
  }

  const variantList = getVariantList(term);
  if (selector && variantList) {
    return SelectExpression(local, {...variantList, selector});
  }

  return Type(local, term);
}

// Helper: convert a value into a variant list, if possible.
function getVariantList(term) {
  const value = term.value || term;
  return Array.isArray(value)
    && value[0].type === "select"
    && value[0].selector === null
    ? value[0]
    : null;
}

// Resolve a call to a Function with positional and key-value arguments.
function FunctionReference(env, {name, args}) {
  // Some functions are built-in. Others may be provided by the runtime via
  // the `FluentBundle` constructor.
  const {bundle: {_functions}, errors} = env;
  const func = _functions[name] || builtins[name];

  if (!func) {
    errors.push(new ReferenceError(`Unknown function: ${name}()`));
    return new FluentNone(`${name}()`);
  }

  if (typeof func !== "function") {
    errors.push(new TypeError(`Function ${name}() is not callable`));
    return new FluentNone(`${name}()`);
  }

  try {
    return func(...getArguments(env, args));
  } catch (e) {
    // XXX Report errors.
    return new FluentNone();
  }
}

// Resolve a select expression to the member object.
function SelectExpression(env, {selector, variants, star}) {
  if (selector === null) {
    return getDefault(env, variants, star);
  }

  let sel = Type(env, selector);
  if (sel instanceof FluentNone) {
    const variant = getDefault(env, variants, star);
    return Type(env, variant);
  }

  // Match the selector against keys of each variant, in order.
  for (const variant of variants) {
    const key = Type(env, variant.key);
    if (match(env.bundle, sel, key)) {
      return Type(env, variant);
    }
  }

  const variant = getDefault(env, variants, star);
  return Type(env, variant);
}

// Resolve a pattern (a complex string with placeables).
function Pattern(env, ptn) {
  const { bundle, dirty, errors } = env;

  if (dirty.has(ptn)) {
    errors.push(new RangeError("Cyclic reference"));
    return new FluentNone();
  }

  // Tag the pattern as dirty for the purpose of the current resolution.
  dirty.add(ptn);
  const result = [];

  // Wrap interpolations with Directional Isolate Formatting characters
  // only when the pattern has more than one element.
  const useIsolating = bundle._useIsolating && ptn.length > 1;

  for (const elem of ptn) {
    if (typeof elem === "string") {
      result.push(bundle._transform(elem));
      continue;
    }

    const part = Type(env, elem).toString(bundle);

    if (useIsolating) {
      result.push(FSI);
    }

    if (part.length > MAX_PLACEABLE_LENGTH) {
      errors.push(
        new RangeError(
          "Too many characters in placeable " +
          `(${part.length}, max allowed is ${MAX_PLACEABLE_LENGTH})`
        )
      );
      result.push(part.slice(MAX_PLACEABLE_LENGTH));
    } else {
      result.push(part);
    }

    if (useIsolating) {
      result.push(PDI);
    }
  }

  dirty.delete(ptn);
  return result.join("");
}

/**
 * Format a translation into a string.
 *
 * @param   {FluentBundle} bundle
 *    A FluentBundle instance which will be used to resolve the
 *    contextual information of the message.
 * @param   {Object}         args
 *    List of arguments provided by the developer which can be accessed
 *    from the message.
 * @param   {Object}         message
 *    An object with the Message to be resolved.
 * @param   {Array}          errors
 *    An error array that any encountered errors will be appended to.
 * @returns {FluentType}
 */
function resolve(bundle, args, message, errors = []) {
  const env = {
    bundle, args, errors, dirty: new WeakSet()
  };
  return Type(env, message).toString(bundle);
}

class FluentError extends Error {}

// This regex is used to iterate through the beginnings of messages and terms.
// With the /m flag, the ^ matches at the beginning of every line.
const RE_MESSAGE_START = /^(-?[a-zA-Z][\w-]*) *= */mg;

// Both Attributes and Variants are parsed in while loops. These regexes are
// used to break out of them.
const RE_ATTRIBUTE_START = /\.([a-zA-Z][\w-]*) *= */y;
const RE_VARIANT_START = /\*?\[/y;

const RE_NUMBER_LITERAL = /(-?[0-9]+(\.[0-9]+)?)/y;
const RE_IDENTIFIER = /([a-zA-Z][\w-]*)/y;
const RE_REFERENCE = /([$-])?([a-zA-Z][\w-]*)(?:\.([a-zA-Z][\w-]*))?/y;

// A "run" is a sequence of text or string literal characters which don't
// require any special handling. For TextElements such special characters are: {
// (starts a placeable), and line breaks which require additional logic to check
// if the next line is indented. For StringLiterals they are: \ (starts an
// escape sequence), " (ends the literal), and line breaks which are not allowed
// in StringLiterals. Note that string runs may be empty; text runs may not.
const RE_TEXT_RUN = /([^{}\n\r]+)/y;
const RE_STRING_RUN = /([^\\"\n\r]*)/y;

// Escape sequences.
const RE_STRING_ESCAPE = /\\([\\"])/y;
const RE_UNICODE_ESCAPE = /\\u([a-fA-F0-9]{4})|\\U([a-fA-F0-9]{6})/y;

// Used for trimming TextElements and indents.
const RE_LEADING_NEWLINES = /^\n+/;
const RE_TRAILING_SPACES = / +$/;
// Used in makeIndent to strip spaces from blank lines and normalize CRLF to LF.
const RE_BLANK_LINES = / *\r?\n/g;
// Used in makeIndent to measure the indentation.
const RE_INDENT = /( *)$/;

// Common tokens.
const TOKEN_BRACE_OPEN = /{\s*/y;
const TOKEN_BRACE_CLOSE = /\s*}/y;
const TOKEN_BRACKET_OPEN = /\[\s*/y;
const TOKEN_BRACKET_CLOSE = /\s*] */y;
const TOKEN_PAREN_OPEN = /\s*\(\s*/y;
const TOKEN_ARROW = /\s*->\s*/y;
const TOKEN_COLON = /\s*:\s*/y;
// Note the optional comma. As a deviation from the Fluent EBNF, the parser
// doesn't enforce commas between call arguments.
const TOKEN_COMMA = /\s*,?\s*/y;
const TOKEN_BLANK = /\s+/y;

// Maximum number of placeables in a single Pattern to protect against Quadratic
// Blowup attacks. See https://msdn.microsoft.com/en-us/magazine/ee335713.aspx.
const MAX_PLACEABLES = 100;

/**
 * Fluent Resource is a structure storing a map of parsed localization entries.
 */
class FluentResource extends Map {
  /**
   * Create a new FluentResource from Fluent code.
   */
  static fromString(source) {
    RE_MESSAGE_START.lastIndex = 0;

    let resource = new this();
    let cursor = 0;

    // Iterate over the beginnings of messages and terms to efficiently skip
    // comments and recover from errors.
    while (true) {
      let next = RE_MESSAGE_START.exec(source);
      if (next === null) {
        break;
      }

      cursor = RE_MESSAGE_START.lastIndex;
      try {
        resource.set(next[1], parseMessage());
      } catch (err) {
        if (err instanceof FluentError) {
          // Don't report any Fluent syntax errors. Skip directly to the
          // beginning of the next message or term.
          continue;
        }
        throw err;
      }
    }

    return resource;

    // The parser implementation is inlined below for performance reasons.

    // The parser focuses on minimizing the number of false negatives at the
    // expense of increasing the risk of false positives. In other words, it
    // aims at parsing valid Fluent messages with a success rate of 100%, but it
    // may also parse a few invalid messages which the reference parser would
    // reject. The parser doesn't perform any validation and may produce entries
    // which wouldn't make sense in the real world. For best results users are
    // advised to validate translations with the fluent-syntax parser
    // pre-runtime.

    // The parser makes an extensive use of sticky regexes which can be anchored
    // to any offset of the source string without slicing it. Errors are thrown
    // to bail out of parsing of ill-formed messages.

    function test(re) {
      re.lastIndex = cursor;
      return re.test(source);
    }

    // Advance the cursor by the char if it matches. May be used as a predicate
    // (was the match found?) or, if errorClass is passed, as an assertion.
    function consumeChar(char, errorClass) {
      if (source[cursor] === char) {
        cursor++;
        return true;
      }
      if (errorClass) {
        throw new errorClass(`Expected ${char}`);
      }
      return false;
    }

    // Advance the cursor by the token if it matches. May be used as a predicate
    // (was the match found?) or, if errorClass is passed, as an assertion.
    function consumeToken(re, errorClass) {
      if (test(re)) {
        cursor = re.lastIndex;
        return true;
      }
      if (errorClass) {
        throw new errorClass(`Expected ${re.toString()}`);
      }
      return false;
    }

    // Execute a regex, advance the cursor, and return all capture groups.
    function match(re) {
      re.lastIndex = cursor;
      let result = re.exec(source);
      if (result === null) {
        throw new FluentError(`Expected ${re.toString()}`);
      }
      cursor = re.lastIndex;
      return result;
    }

    // Execute a regex, advance the cursor, and return the capture group.
    function match1(re) {
      return match(re)[1];
    }

    function parseMessage() {
      let value = parsePattern();
      let attrs = parseAttributes();

      if (attrs === null) {
        if (value === null) {
          throw new FluentError("Expected message value or attributes");
        }
        return value;
      }

      return {value, attrs};
    }

    function parseAttributes() {
      let attrs = {};

      while (test(RE_ATTRIBUTE_START)) {
        let name = match1(RE_ATTRIBUTE_START);
        let value = parsePattern();
        if (value === null) {
          throw new FluentError("Expected attribute value");
        }
        attrs[name] = value;
      }

      return Object.keys(attrs).length > 0 ? attrs : null;
    }

    function parsePattern() {
      // First try to parse any simple text on the same line as the id.
      if (test(RE_TEXT_RUN)) {
        var first = match1(RE_TEXT_RUN);
      }

      // If there's a placeable on the first line, parse a complex pattern.
      if (source[cursor] === "{" || source[cursor] === "}") {
        // Re-use the text parsed above, if possible.
        return parsePatternElements(first ? [first] : [], Infinity);
      }

      // RE_TEXT_VALUE stops at newlines. Only continue parsing the pattern if
      // what comes after the newline is indented.
      let indent = parseIndent();
      if (indent) {
        if (first) {
          // If there's text on the first line, the blank block is part of the
          // translation content in its entirety.
          return parsePatternElements([first, indent], indent.length);
        }
        // Otherwise, we're dealing with a block pattern, i.e. a pattern which
        // starts on a new line. Discrad the leading newlines but keep the
        // inline indent; it will be used by the dedentation logic.
        indent.value = trim(indent.value, RE_LEADING_NEWLINES);
        return parsePatternElements([indent], indent.length);
      }

      if (first) {
        // It was just a simple inline text after all.
        return trim(first, RE_TRAILING_SPACES);
      }

      return null;
    }

    // Parse a complex pattern as an array of elements.
    function parsePatternElements(elements = [], commonIndent) {
      let placeableCount = 0;

      while (true) {
        if (test(RE_TEXT_RUN)) {
          elements.push(match1(RE_TEXT_RUN));
          continue;
        }

        if (source[cursor] === "{") {
          if (++placeableCount > MAX_PLACEABLES) {
            throw new FluentError("Too many placeables");
          }
          elements.push(parsePlaceable());
          continue;
        }

        if (source[cursor] === "}") {
          throw new FluentError("Unbalanced closing brace");
        }

        let indent = parseIndent();
        if (indent) {
          elements.push(indent);
          commonIndent = Math.min(commonIndent, indent.length);
          continue;
        }

        break;
      }

      let lastIndex = elements.length - 1;
      // Trim the trailing spaces in the last element if it's a TextElement.
      if (typeof elements[lastIndex] === "string") {
        elements[lastIndex] = trim(elements[lastIndex], RE_TRAILING_SPACES);
      }

      let baked = [];
      for (let element of elements) {
        if (element.type === "indent") {
          // Dedent indented lines by the maximum common indent.
          element = element.value.slice(0, element.value.length - commonIndent);
        } else if (element.type === "str") {
          // Optimize StringLiterals into their value.
          element = element.value;
        }
        if (element) {
          baked.push(element);
        }
      }
      return baked;
    }

    function parsePlaceable() {
      consumeToken(TOKEN_BRACE_OPEN, FluentError);

      // VariantLists are parsed as selector-less SelectExpressions.
      let onlyVariants = parseVariants();
      if (onlyVariants) {
        consumeToken(TOKEN_BRACE_CLOSE, FluentError);
        return {type: "select", selector: null, ...onlyVariants};
      }

      let selector = parseInlineExpression();
      if (consumeToken(TOKEN_BRACE_CLOSE)) {
        return selector;
      }

      if (consumeToken(TOKEN_ARROW)) {
        let variants = parseVariants();
        consumeToken(TOKEN_BRACE_CLOSE, FluentError);
        return {type: "select", selector, ...variants};
      }

      throw new FluentError("Unclosed placeable");
    }

    function parseInlineExpression() {
      if (source[cursor] === "{") {
        // It's a nested placeable.
        return parsePlaceable();
      }

      if (test(RE_REFERENCE)) {
        let [, sigil, name, attr = null] = match(RE_REFERENCE);
        let type = {"$": "var", "-": "term"}[sigil] || "ref";

        if (source[cursor] === "[") {
          // DEPRECATED VariantExpressions will be removed before 1.0.
          return {type, name, selector: parseVariantKey()};
        }

        if (consumeToken(TOKEN_PAREN_OPEN)) {
          return {type, name, attr, args: parseArguments()};
        }

        return {type, name, attr, args: null};
      }

      return parseLiteral();
    }

    function parseArguments() {
      let args = [];
      while (true) {
        switch (source[cursor]) {
          case ")": // End of the argument list.
            cursor++;
            return args;
          case undefined: // EOF
            throw new FluentError("Unclosed argument list");
        }

        args.push(parseArgument());
        // Commas between arguments are treated as whitespace.
        consumeToken(TOKEN_COMMA);
      }
    }

    function parseArgument() {
      let ref = parseInlineExpression();
      if (ref.type !== "ref") {
        return ref;
      }

      if (consumeToken(TOKEN_COLON)) {
        // The reference is the beginning of a named argument.
        return {type: "narg", name: ref.name, value: parseLiteral()};
      }

      // It's a regular message reference.
      return ref;
    }

    function parseVariants() {
      let variants = [];
      let count = 0;
      let star;

      while (test(RE_VARIANT_START)) {
        if (consumeChar("*")) {
          star = count;
        }

        let key = parseVariantKey();
        let value = parsePattern();
        if (value === null) {
          throw new FluentError("Expected variant value");
        }
        variants[count++] = {key, value};
      }

      if (count === 0) {
        return null;
      }

      if (star === undefined) {
        throw new FluentError("Expected default variant");
      }

      return {variants, star};
    }

    function parseVariantKey() {
      consumeToken(TOKEN_BRACKET_OPEN, FluentError);
      let key = test(RE_NUMBER_LITERAL)
        ? parseNumberLiteral()
        : match1(RE_IDENTIFIER);
      consumeToken(TOKEN_BRACKET_CLOSE, FluentError);
      return key;
    }

    function parseLiteral() {
      if (test(RE_NUMBER_LITERAL)) {
        return parseNumberLiteral();
      }

      if (source[cursor] === "\"") {
        return parseStringLiteral();
      }

      throw new FluentError("Invalid expression");
    }

    function parseNumberLiteral() {
      return {type: "num", value: match1(RE_NUMBER_LITERAL)};
    }

    function parseStringLiteral() {
      consumeChar("\"", FluentError);
      let value = "";
      while (true) {
        value += match1(RE_STRING_RUN);

        if (source[cursor] === "\\") {
          value += parseEscapeSequence();
          continue;
        }

        if (consumeChar("\"")) {
          return {type: "str", value};
        }

        // We've reached an EOL of EOF.
        throw new FluentError("Unclosed string literal");
      }
    }

    // Unescape known escape sequences.
    function parseEscapeSequence() {
      if (test(RE_STRING_ESCAPE)) {
        return match1(RE_STRING_ESCAPE);
      }

      if (test(RE_UNICODE_ESCAPE)) {
        let [, codepoint4, codepoint6] = match(RE_UNICODE_ESCAPE);
        let codepoint = parseInt(codepoint4 || codepoint6, 16);
        return codepoint <= 0xD7FF || 0xE000 <= codepoint
          // It's a Unicode scalar value.
          ? String.fromCodePoint(codepoint)
          // Lonely surrogates can cause trouble when the parsing result is
          // saved using UTF-8. Use U+FFFD REPLACEMENT CHARACTER instead.
          : "�";
      }

      throw new FluentError("Unknown escape sequence");
    }

    // Parse blank space. Return it if it looks like indent before a pattern
    // line. Skip it othwerwise.
    function parseIndent() {
      let start = cursor;
      consumeToken(TOKEN_BLANK);

      // Check the first non-blank character after the indent.
      switch (source[cursor]) {
        case ".":
        case "[":
        case "*":
        case "}":
        case undefined: // EOF
          // A special character. End the Pattern.
          return false;
        case "{":
          // Placeables don't require indentation (in EBNF: block-placeable).
          // Continue the Pattern.
          return makeIndent(source.slice(start, cursor));
      }

      // If the first character on the line is not one of the special characters
      // listed above, it's a regular text character. Check if there's at least
      // one space of indent before it.
      if (source[cursor - 1] === " ") {
        // It's an indented text character (in EBNF: indented-char). Continue
        // the Pattern.
        return makeIndent(source.slice(start, cursor));
      }

      // A not-indented text character is likely the identifier of the next
      // message. End the Pattern.
      return false;
    }

    // Trim blanks in text according to the given regex.
    function trim(text, re) {
      return text.replace(re, "");
    }

    // Normalize a blank block and extract the indent details.
    function makeIndent(blank) {
      let value = blank.replace(RE_BLANK_LINES, "\n");
      let length = RE_INDENT.exec(blank)[1].length;
      return {type: "indent", value, length};
    }
  }
}

/**
 * Message bundles are single-language stores of translations.  They are
 * responsible for parsing translation resources in the Fluent syntax and can
 * format translation units (entities) to strings.
 *
 * Always use `FluentBundle.format` to retrieve translation units from a
 * bundle. Translations can contain references to other entities or variables,
 * conditional logic in form of select expressions, traits which describe their
 * grammatical features, and can use Fluent builtins which make use of the
 * `Intl` formatters to format numbers, dates, lists and more into the
 * bundle's language. See the documentation of the Fluent syntax for more
 * information.
 */
class FluentBundle {

  /**
   * Create an instance of `FluentBundle`.
   *
   * The `locales` argument is used to instantiate `Intl` formatters used by
   * translations.  The `options` object can be used to configure the bundle.
   *
   * Examples:
   *
   *     const bundle = new FluentBundle(locales);
   *
   *     const bundle = new FluentBundle(locales, { useIsolating: false });
   *
   *     const bundle = new FluentBundle(locales, {
   *       useIsolating: true,
   *       functions: {
   *         NODE_ENV: () => process.env.NODE_ENV
   *       }
   *     });
   *
   * Available options:
   *
   *   - `functions` - an object of additional functions available to
   *                   translations as builtins.
   *
   *   - `useIsolating` - boolean specifying whether to use Unicode isolation
   *                    marks (FSI, PDI) for bidi interpolations.
   *
   *   - `transform` - a function used to transform string parts of patterns.
   *
   * @param   {string|Array<string>} locales - Locale or locales of the bundle
   * @param   {Object} [options]
   * @returns {FluentBundle}
   */
  constructor(locales, {
    functions = {},
    useIsolating = true,
    transform = v => v
  } = {}) {
    this.locales = Array.isArray(locales) ? locales : [locales];

    this._terms = new Map();
    this._messages = new Map();
    this._functions = functions;
    this._useIsolating = useIsolating;
    this._transform = transform;
    this._intls = new WeakMap();
  }

  /*
   * Return an iterator over public `[id, message]` pairs.
   *
   * @returns {Iterator}
   */
  get messages() {
    return this._messages[Symbol.iterator]();
  }

  /*
   * Check if a message is present in the bundle.
   *
   * @param {string} id - The identifier of the message to check.
   * @returns {bool}
   */
  hasMessage(id) {
    return this._messages.has(id);
  }

  /*
   * Return the internal representation of a message.
   *
   * The internal representation should only be used as an argument to
   * `FluentBundle.format`.
   *
   * @param {string} id - The identifier of the message to check.
   * @returns {Any}
   */
  getMessage(id) {
    return this._messages.get(id);
  }

  /**
   * Add a translation resource to the bundle.
   *
   * The translation resource must use the Fluent syntax.  It will be parsed by
   * the bundle and each translation unit (message) will be available in the
   * bundle by its identifier.
   *
   *     bundle.addMessages('foo = Foo');
   *     bundle.getMessage('foo');
   *
   *     // Returns a raw representation of the 'foo' message.
   *
   * Parsed entities should be formatted with the `format` method in case they
   * contain logic (references, select expressions etc.).
   *
   * @param   {string} source - Text resource with translations.
   * @returns {Array<Error>}
   */
  addMessages(source) {
    const res = FluentResource.fromString(source);
    return this.addResource(res);
  }

  /**
   * Add a translation resource to the bundle.
   *
   * The translation resource must be an instance of FluentResource,
   * e.g. parsed by `FluentResource.fromString`.
   *
   *     let res = FluentResource.fromString("foo = Foo");
   *     bundle.addResource(res);
   *     bundle.getMessage('foo');
   *
   *     // Returns a raw representation of the 'foo' message.
   *
   * Parsed entities should be formatted with the `format` method in case they
   * contain logic (references, select expressions etc.).
   *
   * @param   {FluentResource} res - FluentResource object.
   * @returns {Array<Error>}
   */
  addResource(res) {
    const errors = [];

    for (const [id, value] of res) {
      if (id.startsWith("-")) {
        // Identifiers starting with a dash (-) define terms. Terms are private
        // and cannot be retrieved from FluentBundle.
        if (this._terms.has(id)) {
          errors.push(`Attempt to override an existing term: "${id}"`);
          continue;
        }
        this._terms.set(id, value);
      } else {
        if (this._messages.has(id)) {
          errors.push(`Attempt to override an existing message: "${id}"`);
          continue;
        }
        this._messages.set(id, value);
      }
    }

    return errors;
  }

  /**
   * Format a message to a string or null.
   *
   * Format a raw `message` from the bundle into a string (or a null if it has
   * a null value).  `args` will be used to resolve references to variables
   * passed as arguments to the translation.
   *
   * In case of errors `format` will try to salvage as much of the translation
   * as possible and will still return a string.  For performance reasons, the
   * encountered errors are not returned but instead are appended to the
   * `errors` array passed as the third argument.
   *
   *     const errors = [];
   *     bundle.addMessages('hello = Hello, { $name }!');
   *     const hello = bundle.getMessage('hello');
   *     bundle.format(hello, { name: 'Jane' }, errors);
   *
   *     // Returns 'Hello, Jane!' and `errors` is empty.
   *
   *     bundle.format(hello, undefined, errors);
   *
   *     // Returns 'Hello, name!' and `errors` is now:
   *
   *     [<ReferenceError: Unknown variable: name>]
   *
   * @param   {Object | string}    message
   * @param   {Object | undefined} args
   * @param   {Array}              errors
   * @returns {?string}
   */
  format(message, args, errors) {
    // optimize entities which are simple strings with no attributes
    if (typeof message === "string") {
      return this._transform(message);
    }

    // optimize entities with null values
    if (message === null || message.value === null) {
      return null;
    }

    // optimize simple-string entities with attributes
    if (typeof message.value === "string") {
      return this._transform(message.value);
    }

    return resolve(this, args, message, errors);
  }

  _memoizeIntlObject(ctor, opts) {
    const cache = this._intls.get(ctor) || {};
    const id = JSON.stringify(opts);

    if (!cache[id]) {
      cache[id] = new ctor(this.locales, opts);
      this._intls.set(ctor, cache);
    }

    return cache[id];
  }
}

/*
 * @module fluent
 * @overview
 *
 * `fluent` is a JavaScript implementation of Project Fluent, a localization
 * framework designed to unleash the expressive power of the natural language.
 *
 */

/* eslint no-console: ["error", {allow: ["warn"]}] */
/* global console */

// Match the opening angle bracket (<) in HTML tags, and HTML entities like
// &amp;, &#0038;, &#x0026;.
const reOverlay = /<|&#?\w+;/;

/**
 * Elements allowed in translations even if they are not present in the source
 * HTML. They are text-level elements as defined by the HTML5 spec:
 * https://www.w3.org/TR/html5/text-level-semantics.html with the exception of:
 *
 *   - a - because we don't allow href on it anyways,
 *   - ruby, rt, rp - because we don't allow nested elements to be inserted.
 */
const TEXT_LEVEL_ELEMENTS = {
  "http://www.w3.org/1999/xhtml": [
    "em", "strong", "small", "s", "cite", "q", "dfn", "abbr", "data",
    "time", "code", "var", "samp", "kbd", "sub", "sup", "i", "b", "u",
    "mark", "bdi", "bdo", "span", "br", "wbr"
  ],
};

const LOCALIZABLE_ATTRIBUTES = {
  "http://www.w3.org/1999/xhtml": {
    global: ["title", "aria-label", "aria-valuetext", "aria-moz-hint"],
    a: ["download"],
    area: ["download", "alt"],
    // value is special-cased in isAttrNameLocalizable
    input: ["alt", "placeholder"],
    menuitem: ["label"],
    menu: ["label"],
    optgroup: ["label"],
    option: ["label"],
    track: ["label"],
    img: ["alt"],
    textarea: ["placeholder"],
    th: ["abbr"]
  },
  "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul": {
    global: [
      "accesskey", "aria-label", "aria-valuetext", "aria-moz-hint", "label"
    ],
    key: ["key", "keycode"],
    textbox: ["placeholder"],
    toolbarbutton: ["tooltiptext"],
  }
};


/**
 * Translate an element.
 *
 * Translate the element's text content and attributes. Some HTML markup is
 * allowed in the translation. The element's children with the data-l10n-name
 * attribute will be treated as arguments to the translation. If the
 * translation defines the same children, their attributes and text contents
 * will be used for translating the matching source child.
 *
 * @param   {Element} element
 * @param   {Object} translation
 * @private
 */
function translateElement(element, translation) {
  const {value} = translation;

  if (typeof value === "string") {
    if (!reOverlay.test(value)) {
      // If the translation doesn't contain any markup skip the overlay logic.
      element.textContent = value;
    } else {
      // Else parse the translation's HTML using an inert template element,
      // sanitize it and replace the element's content.
      const templateElement = element.ownerDocument.createElementNS(
        "http://www.w3.org/1999/xhtml", "template"
      );
      templateElement.innerHTML = value;
      overlayChildNodes(templateElement.content, element);
    }
  }

  // Even if the translation doesn't define any localizable attributes, run
  // overlayAttributes to remove any localizable attributes set by previous
  // translations.
  overlayAttributes(translation, element);
}

/**
 * Replace child nodes of an element with child nodes of another element.
 *
 * The contents of the target element will be cleared and fully replaced with
 * sanitized contents of the source element.
 *
 * @param {DocumentFragment} fromFragment - The source of children to overlay.
 * @param {Element} toElement - The target of the overlay.
 * @private
 */
function overlayChildNodes(fromFragment, toElement) {
  for (const childNode of fromFragment.childNodes) {
    if (childNode.nodeType === childNode.TEXT_NODE) {
      // Keep the translated text node.
      continue;
    }

    if (childNode.hasAttribute("data-l10n-name")) {
      const sanitized = namedChildFrom(toElement, childNode);
      fromFragment.replaceChild(sanitized, childNode);
      continue;
    }

    if (isElementAllowed(childNode)) {
      const sanitized = allowedChild(childNode);
      fromFragment.replaceChild(sanitized, childNode);
      continue;
    }

    console.warn(
      `An element of forbidden type "${childNode.localName}" was found in ` +
      "the translation. Only safe text-level elements and elements with " +
      "data-l10n-name are allowed."
    );

    // If all else fails, replace the element with its text content.
    fromFragment.replaceChild(textNode(childNode), childNode);
  }

  toElement.textContent = "";
  toElement.appendChild(fromFragment);
}

/**
 * Transplant localizable attributes of an element to another element.
 *
 * Any localizable attributes already set on the target element will be
 * cleared.
 *
 * @param   {Element|Object} fromElement - The source of child nodes to overlay.
 * @param   {Element} toElement - The target of the overlay.
 * @private
 */
function overlayAttributes(fromElement, toElement) {
  const explicitlyAllowed = toElement.hasAttribute("data-l10n-attrs")
    ? toElement.getAttribute("data-l10n-attrs")
      .split(",").map(i => i.trim())
    : null;

  // Remove existing localizable attributes.
  for (const attr of Array.from(toElement.attributes)) {
    if (isAttrNameLocalizable(attr.name, toElement, explicitlyAllowed)) {
      toElement.removeAttribute(attr.name);
    }
  }

  // fromElement might be a {value, attributes} object as returned by
  // Localization.messageFromBundle. In which case attributes may be null to
  // save GC cycles.
  if (!fromElement.attributes) {
    return;
  }

  // Set localizable attributes.
  for (const attr of Array.from(fromElement.attributes)) {
    if (isAttrNameLocalizable(attr.name, toElement, explicitlyAllowed)) {
      toElement.setAttribute(attr.name, attr.value);
    }
  }
}

/**
 * Sanitize a child element created by the translation.
 *
 * Try to find a corresponding child in sourceElement and use it as the base
 * for the sanitization. This will preserve functional attribtues defined on
 * the child element in the source HTML.
 *
 * @param   {Element} sourceElement - The source for data-l10n-name lookups.
 * @param   {Element} translatedChild - The translated child to be sanitized.
 * @returns {Element}
 * @private
 */
function namedChildFrom(sourceElement, translatedChild) {
  const childName = translatedChild.getAttribute("data-l10n-name");
  const sourceChild = sourceElement.querySelector(
    `[data-l10n-name="${childName}"]`
  );

  if (!sourceChild) {
    console.warn(
      `An element named "${childName}" wasn't found in the source.`
    );
    return textNode(translatedChild);
  }

  if (sourceChild.localName !== translatedChild.localName) {
    console.warn(
      `An element named "${childName}" was found in the translation ` +
      `but its type ${translatedChild.localName} didn't match the ` +
      `element found in the source (${sourceChild.localName}).`
    );
    return textNode(translatedChild);
  }

  // Remove it from sourceElement so that the translation cannot use
  // the same reference name again.
  sourceElement.removeChild(sourceChild);
  // We can't currently guarantee that a translation won't remove
  // sourceChild from the element completely, which could break the app if
  // it relies on an event handler attached to the sourceChild. Let's make
  // this limitation explicit for now by breaking the identitiy of the
  // sourceChild by cloning it. This will destroy all event handlers
  // attached to sourceChild via addEventListener and via on<name>
  // properties.
  const clone = sourceChild.cloneNode(false);
  return shallowPopulateUsing(translatedChild, clone);
}

/**
 * Sanitize an allowed element.
 *
 * Text-level elements allowed in translations may only use safe attributes
 * and will have any nested markup stripped to text content.
 *
 * @param   {Element} element - The element to be sanitized.
 * @returns {Element}
 * @private
 */
function allowedChild(element) {
  // Start with an empty element of the same type to remove nested children
  // and non-localizable attributes defined by the translation.
  const clone = element.ownerDocument.createElement(element.localName);
  return shallowPopulateUsing(element, clone);
}

/**
 * Convert an element to a text node.
 *
 * @param   {Element} element - The element to be sanitized.
 * @returns {Node}
 * @private
 */
function textNode(element) {
  return element.ownerDocument.createTextNode(element.textContent);
}

/**
 * Check if element is allowed in the translation.
 *
 * This method is used by the sanitizer when the translation markup contains
 * an element which is not present in the source code.
 *
 * @param   {Element} element
 * @returns {boolean}
 * @private
 */
function isElementAllowed(element) {
  const allowed = TEXT_LEVEL_ELEMENTS[element.namespaceURI];
  return allowed && allowed.includes(element.localName);
}

/**
 * Check if attribute is allowed for the given element.
 *
 * This method is used by the sanitizer when the translation markup contains
 * DOM attributes, or when the translation has traits which map to DOM
 * attributes.
 *
 * `explicitlyAllowed` can be passed as a list of attributes explicitly
 * allowed on this element.
 *
 * @param   {string}         name
 * @param   {Element}        element
 * @param   {Array}          explicitlyAllowed
 * @returns {boolean}
 * @private
 */
function isAttrNameLocalizable(name, element, explicitlyAllowed = null) {
  if (explicitlyAllowed && explicitlyAllowed.includes(name)) {
    return true;
  }

  const allowed = LOCALIZABLE_ATTRIBUTES[element.namespaceURI];
  if (!allowed) {
    return false;
  }

  const attrName = name.toLowerCase();
  const elemName = element.localName;

  // Is it a globally safe attribute?
  if (allowed.global.includes(attrName)) {
    return true;
  }

  // Are there no allowed attributes for this element?
  if (!allowed[elemName]) {
    return false;
  }

  // Is it allowed on this element?
  if (allowed[elemName].includes(attrName)) {
    return true;
  }

  // Special case for value on HTML inputs with type button, reset, submit
  if (element.namespaceURI === "http://www.w3.org/1999/xhtml" &&
      elemName === "input" && attrName === "value") {
    const type = element.type.toLowerCase();
    if (type === "submit" || type === "button" || type === "reset") {
      return true;
    }
  }

  return false;
}

/**
 * Helper to set textContent and localizable attributes on an element.
 *
 * @param   {Element} fromElement
 * @param   {Element} toElement
 * @returns {Element}
 * @private
 */
function shallowPopulateUsing(fromElement, toElement) {
  toElement.textContent = fromElement.textContent;
  overlayAttributes(fromElement, toElement);
  return toElement;
}

/*
 * Base CachedIterable class.
 */
class CachedIterable extends Array {
    /**
     * Create a `CachedIterable` instance from an iterable or, if another
     * instance of `CachedIterable` is passed, return it without any
     * modifications.
     *
     * @param {Iterable} iterable
     * @returns {CachedIterable}
     */
    static from(iterable) {
        if (iterable instanceof this) {
            return iterable;
        }

        return new this(iterable);
    }
}

/*
 * CachedAsyncIterable caches the elements yielded by an async iterable.
 *
 * It can be used to iterate over an iterable many times without depleting the
 * iterable.
 */
class CachedAsyncIterable extends CachedIterable {
    /**
     * Create an `CachedAsyncIterable` instance.
     *
     * @param {Iterable} iterable
     * @returns {CachedAsyncIterable}
     */
    constructor(iterable) {
        super();

        if (Symbol.asyncIterator in Object(iterable)) {
            this.iterator = iterable[Symbol.asyncIterator]();
        } else if (Symbol.iterator in Object(iterable)) {
            this.iterator = iterable[Symbol.iterator]();
        } else {
            throw new TypeError("Argument must implement the iteration protocol.");
        }
    }

    /**
     * Synchronous iterator over the cached elements.
     *
     * Return a generator object implementing the iterator protocol over the
     * cached elements of the original (async or sync) iterable.
     */
    [Symbol.iterator]() {
        const cached = this;
        let cur = 0;

        return {
            next() {
                if (cached.length === cur) {
                    return {value: undefined, done: true};
                }
                return cached[cur++];
            }
        };
    }

    /**
     * Asynchronous iterator caching the yielded elements.
     *
     * Elements yielded by the original iterable will be cached and available
     * synchronously. Returns an async generator object implementing the
     * iterator protocol over the elements of the original (async or sync)
     * iterable.
     */
    [Symbol.asyncIterator]() {
        const cached = this;
        let cur = 0;

        return {
            async next() {
                if (cached.length <= cur) {
                    cached.push(await cached.iterator.next());
                }
                return cached[cur++];
            }
        };
    }

    /**
     * This method allows user to consume the next element from the iterator
     * into the cache.
     *
     * @param {number} count - number of elements to consume
     */
    async touchNext(count = 1) {
        let idx = 0;
        while (idx++ < count) {
            const last = this[this.length - 1];
            if (last && last.done) {
                break;
            }
            this.push(await this.iterator.next());
        }
        // Return the last cached {value, done} object to allow the calling
        // code to decide if it needs to call touchNext again.
        return this[this.length - 1];
    }
}

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

/**
 * The `Localization` class is a central high-level API for vanilla
 * JavaScript use of Fluent.
 * It combines language negotiation, FluentBundle and I/O to
 * provide a scriptable API to format translations.
 */
class Localization {
  /**
   * @param {Array<String>} resourceIds     - List of resource IDs
   * @param {Function}      generateBundles - Function that returns a
   *                                          generator over FluentBundles
   *
   * @returns {Localization}
   */
  constructor(resourceIds = [], generateBundles) {
    this.resourceIds = resourceIds;
    this.generateBundles = generateBundles;
    this.bundles = CachedAsyncIterable.from(
      this.generateBundles(this.resourceIds));
  }

  addResourceIds(resourceIds) {
    this.resourceIds.push(...resourceIds);
    this.onChange();
    return this.resourceIds.length;
  }

  removeResourceIds(resourceIds) {
    this.resourceIds = this.resourceIds.filter(r => !resourceIds.includes(r));
    this.onChange();
    return this.resourceIds.length;
  }

  /**
   * Format translations and handle fallback if needed.
   *
   * Format translations for `keys` from `FluentBundle` instances on this
   * DOMLocalization. In case of errors, fetch the next context in the
   * fallback chain.
   *
   * @param   {Array<Object>}         keys    - Translation keys to format.
   * @param   {Function}              method  - Formatting function.
   * @returns {Promise<Array<string|Object>>}
   * @private
   */
  async formatWithFallback(keys, method) {
    const translations = [];

    for await (const bundle of this.bundles) {
      const missingIds = keysFromBundle(method, bundle, keys, translations);

      if (missingIds.size === 0) {
        break;
      }

      if (typeof console !== "undefined") {
        const locale = bundle.locales[0];
        const ids = Array.from(missingIds).join(", ");
        console.warn(`Missing translations in ${locale}: ${ids}`);
      }
    }

    return translations;
  }

  /**
   * Format translations into {value, attributes} objects.
   *
   * The fallback logic is the same as in `formatValues` but the argument type
   * is stricter (an array of arrays) and it returns {value, attributes}
   * objects which are suitable for the translation of DOM elements.
   *
   *     docL10n.formatMessages([
   *       {id: 'hello', args: { who: 'Mary' }},
   *       {id: 'welcome'}
   *     ]).then(console.log);
   *
   *     // [
   *     //   { value: 'Hello, Mary!', attributes: null },
   *     //   {
   *     //     value: 'Welcome!',
   *     //     attributes: [ { name: "title", value: 'Hello' } ]
   *     //   }
   *     // ]
   *
   * Returns a Promise resolving to an array of the translation strings.
   *
   * @param   {Array<Object>} keys
   * @returns {Promise<Array<{value: string, attributes: Object}>>}
   * @private
   */
  formatMessages(keys) {
    return this.formatWithFallback(keys, messageFromBundle);
  }

  /**
   * Retrieve translations corresponding to the passed keys.
   *
   * A generalized version of `DOMLocalization.formatValue`. Keys can
   * either be simple string identifiers or `[id, args]` arrays.
   *
   *     docL10n.formatValues([
   *       {id: 'hello', args: { who: 'Mary' }},
   *       {id: 'hello', args: { who: 'John' }},
   *       {id: 'welcome'}
   *     ]).then(console.log);
   *
   *     // ['Hello, Mary!', 'Hello, John!', 'Welcome!']
   *
   * Returns a Promise resolving to an array of the translation strings.
   *
   * @param   {Array<Object>} keys
   * @returns {Promise<Array<string>>}
   */
  formatValues(keys) {
    return this.formatWithFallback(keys, valueFromBundle);
  }

  /**
   * Retrieve the translation corresponding to the `id` identifier.
   *
   * If passed, `args` is a simple hash object with a list of variables that
   * will be interpolated in the value of the translation.
   *
   *     docL10n.formatValue(
   *       'hello', { who: 'world' }
   *     ).then(console.log);
   *
   *     // 'Hello, world!'
   *
   * Returns a Promise resolving to the translation string.
   *
   * Use this sparingly for one-off messages which don't need to be
   * retranslated when the user changes their language preferences, e.g. in
   * notifications.
   *
   * @param   {string}  id     - Identifier of the translation to format
   * @param   {Object}  [args] - Optional external arguments
   * @returns {Promise<string>}
   */
  async formatValue(id, args) {
    const [val] = await this.formatValues([{id, args}]);
    return val;
  }

  handleEvent() {
    this.onChange();
  }

  /**
   * This method should be called when there's a reason to believe
   * that language negotiation or available resources changed.
   */
  onChange() {
    this.bundles = CachedAsyncIterable.from(
      this.generateBundles(this.resourceIds));
    this.bundles.touchNext(2);
  }
}

/**
 * Format the value of a message into a string.
 *
 * This function is passed as a method to `keysFromBundle` and resolve
 * a value of a single L10n Entity using provided `FluentBundle`.
 *
 * If the function fails to retrieve the entity, it will return an ID of it.
 * If formatting fails, it will return a partially resolved entity.
 *
 * In both cases, an error is being added to the errors array.
 *
 * @param   {FluentBundle} bundle
 * @param   {Array<Error>}   errors
 * @param   {string}         id
 * @param   {Object}         args
 * @returns {string}
 * @private
 */
function valueFromBundle(bundle, errors, id, args) {
  const msg = bundle.getMessage(id);
  return bundle.format(msg, args, errors);
}

/**
 * Format all public values of a message into a {value, attributes} object.
 *
 * This function is passed as a method to `keysFromBundle` and resolve
 * a single L10n Entity using provided `FluentBundle`.
 *
 * The function will return an object with a value and attributes of the
 * entity.
 *
 * If the function fails to retrieve the entity, the value is set to the ID of
 * an entity, and attributes to `null`. If formatting fails, it will return
 * a partially resolved value and attributes.
 *
 * In both cases, an error is being added to the errors array.
 *
 * @param   {FluentBundle} bundle
 * @param   {Array<Error>}   errors
 * @param   {String}         id
 * @param   {Object}         args
 * @returns {Object}
 * @private
 */
function messageFromBundle(bundle, errors, id, args) {
  const msg = bundle.getMessage(id);

  const formatted = {
    value: bundle.format(msg, args, errors),
    attributes: null,
  };

  if (msg.attrs) {
    formatted.attributes = [];
    for (const [name, attr] of Object.entries(msg.attrs)) {
      const value = bundle.format(attr, args, errors);
      if (value !== null) {
        formatted.attributes.push({name, value});
      }
    }
  }

  return formatted;
}

/**
 * This function is an inner function for `Localization.formatWithFallback`.
 *
 * It takes a `FluentBundle`, list of l10n-ids and a method to be used for
 * key resolution (either `valueFromBundle` or `messageFromBundle`) and
 * optionally a value returned from `keysFromBundle` executed against
 * another `FluentBundle`.
 *
 * The idea here is that if the previous `FluentBundle` did not resolve
 * all keys, we're calling this function with the next context to resolve
 * the remaining ones.
 *
 * In the function, we loop over `keys` and check if we have the `prev`
 * passed and if it has an error entry for the position we're in.
 *
 * If it doesn't, it means that we have a good translation for this key and
 * we return it. If it does, we'll try to resolve the key using the passed
 * `FluentBundle`.
 *
 * In the end, we fill the translations array, and return the Set with
 * missing ids.
 *
 * See `Localization.formatWithFallback` for more info on how this is used.
 *
 * @param {Function}       method
 * @param {FluentBundle} bundle
 * @param {Array<string>}  keys
 * @param {{Array<{value: string, attributes: Object}>}} translations
 *
 * @returns {Set<string>}
 * @private
 */
function keysFromBundle(method, bundle, keys, translations) {
  const messageErrors = [];
  const missingIds = new Set();

  keys.forEach(({id, args}, i) => {
    if (translations[i] !== undefined) {
      return;
    }

    if (bundle.hasMessage(id)) {
      messageErrors.length = 0;
      translations[i] = method(bundle, messageErrors, id, args);
      // XXX: Report resolver errors
    } else {
      missingIds.add(id);
    }
  });

  return missingIds;
}

const L10NID_ATTR_NAME = "data-l10n-id";
const L10NARGS_ATTR_NAME = "data-l10n-args";

const L10N_ELEMENT_QUERY = `[${L10NID_ATTR_NAME}]`;

/**
 * The `DOMLocalization` class is responsible for fetching resources and
 * formatting translations.
 *
 * It implements the fallback strategy in case of errors encountered during the
 * formatting of translations and methods for observing DOM
 * trees with a `MutationObserver`.
 */
class DOMLocalization extends Localization {
  /**
   * @param {Array<String>}    resourceIds     - List of resource IDs
   * @param {Function}         generateBundles - Function that returns a
   *                                             generator over FluentBundles
   * @returns {DOMLocalization}
   */
  constructor(resourceIds, generateBundles) {
    super(resourceIds, generateBundles);

    // A Set of DOM trees observed by the `MutationObserver`.
    this.roots = new Set();
    // requestAnimationFrame handler.
    this.pendingrAF = null;
    // list of elements pending for translation.
    this.pendingElements = new Set();
    this.windowElement = null;
    this.mutationObserver = null;

    this.observerConfig = {
      attribute: true,
      characterData: false,
      childList: true,
      subtree: true,
      attributeFilter: [L10NID_ATTR_NAME, L10NARGS_ATTR_NAME]
    };
  }

  onChange() {
    super.onChange();
    this.translateRoots();
  }

  /**
   * Set the `data-l10n-id` and `data-l10n-args` attributes on DOM elements.
   * FluentDOM makes use of mutation observers to detect changes
   * to `data-l10n-*` attributes and translate elements asynchronously.
   * `setAttributes` is a convenience method which allows to translate
   * DOM elements declaratively.
   *
   * You should always prefer to use `data-l10n-id` on elements (statically in
   * HTML or dynamically via `setAttributes`) over manually retrieving
   * translations with `format`.  The use of attributes ensures that the
   * elements can be retranslated when the user changes their language
   * preferences.
   *
   * ```javascript
   * localization.setAttributes(
   *   document.querySelector('#welcome'), 'hello', { who: 'world' }
   * );
   * ```
   *
   * This will set the following attributes on the `#welcome` element.
   * The MutationObserver will pick up this change and will localize the element
   * asynchronously.
   *
   * ```html
   * <p id='welcome'
   *   data-l10n-id='hello'
   *   data-l10n-args='{"who": "world"}'>
   * </p>
   * ```
   *
   * @param {Element}                element - Element to set attributes on
   * @param {string}                 id      - l10n-id string
   * @param {Object<string, string>} args    - KVP list of l10n arguments
   * @returns {Element}
   */
  setAttributes(element, id, args) {
    element.setAttribute(L10NID_ATTR_NAME, id);
    if (args) {
      element.setAttribute(L10NARGS_ATTR_NAME, JSON.stringify(args));
    } else {
      element.removeAttribute(L10NARGS_ATTR_NAME);
    }
    return element;
  }

  /**
   * Get the `data-l10n-*` attributes from DOM elements.
   *
   * ```javascript
   * localization.getAttributes(
   *   document.querySelector('#welcome')
   * );
   * // -> { id: 'hello', args: { who: 'world' } }
   * ```
   *
   * @param   {Element}  element - HTML element
   * @returns {{id: string, args: Object}}
   */
  getAttributes(element) {
    return {
      id: element.getAttribute(L10NID_ATTR_NAME),
      args: JSON.parse(element.getAttribute(L10NARGS_ATTR_NAME) || null)
    };
  }

  /**
   * Add `newRoot` to the list of roots managed by this `DOMLocalization`.
   *
   * Additionally, if this `DOMLocalization` has an observer, start observing
   * `newRoot` in order to translate mutations in it.
   *
   * @param {Element}      newRoot - Root to observe.
   */
  connectRoot(newRoot) {
    for (const root of this.roots) {
      if (root === newRoot ||
          root.contains(newRoot) ||
          newRoot.contains(root)) {
        throw new Error("Cannot add a root that overlaps with existing root.");
      }
    }

    if (this.windowElement) {
      if (this.windowElement !== newRoot.ownerDocument.defaultView) {
        throw new Error(`Cannot connect a root:
          DOMLocalization already has a root from a different window.`);
      }
    } else {
      this.windowElement = newRoot.ownerDocument.defaultView;
      this.mutationObserver = new this.windowElement.MutationObserver(
        mutations => this.translateMutations(mutations)
      );
    }


    this.roots.add(newRoot);
    this.mutationObserver.observe(newRoot, this.observerConfig);
  }

  /**
   * Remove `root` from the list of roots managed by this `DOMLocalization`.
   *
   * Additionally, if this `DOMLocalization` has an observer, stop observing
   * `root`.
   *
   * Returns `true` if the root was the last one managed by this
   * `DOMLocalization`.
   *
   * @param   {Element} root - Root to disconnect.
   * @returns {boolean}
   */
  disconnectRoot(root) {
    this.roots.delete(root);
    // Pause the mutation observer to stop observing `root`.
    this.pauseObserving();

    if (this.roots.size === 0) {
      this.mutationObserver = null;
      this.windowElement = null;
      this.pendingrAF = null;
      this.pendingElements.clear();
      return true;
    }

    // Resume observing all other roots.
    this.resumeObserving();
    return false;
  }

  /**
   * Translate all roots associated with this `DOMLocalization`.
   *
   * @returns {Promise}
   */
  translateRoots() {
    const roots = Array.from(this.roots);
    return Promise.all(
      roots.map(root => this.translateFragment(root))
    );
  }

  /**
   * Pauses the `MutationObserver`.
   *
   * @private
   */
  pauseObserving() {
    if (!this.mutationObserver) {
      return;
    }

    this.translateMutations(this.mutationObserver.takeRecords());
    this.mutationObserver.disconnect();
  }

  /**
   * Resumes the `MutationObserver`.
   *
   * @private
   */
  resumeObserving() {
    if (!this.mutationObserver) {
      return;
    }

    for (const root of this.roots) {
      this.mutationObserver.observe(root, this.observerConfig);
    }
  }

  /**
   * Translate mutations detected by the `MutationObserver`.
   *
   * @private
   */
  translateMutations(mutations) {
    for (const mutation of mutations) {
      switch (mutation.type) {
        case "attributes":
          if (mutation.target.hasAttribute("data-l10n-id")) {
            this.pendingElements.add(mutation.target);
          }
          break;
        case "childList":
          for (const addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === addedNode.ELEMENT_NODE) {
              if (addedNode.childElementCount) {
                for (const element of this.getTranslatables(addedNode)) {
                  this.pendingElements.add(element);
                }
              } else if (addedNode.hasAttribute(L10NID_ATTR_NAME)) {
                this.pendingElements.add(addedNode);
              }
            }
          }
          break;
      }
    }

    // This fragment allows us to coalesce all pending translations
    // into a single requestAnimationFrame.
    if (this.pendingElements.size > 0) {
      if (this.pendingrAF === null) {
        this.pendingrAF = this.windowElement.requestAnimationFrame(() => {
          this.translateElements(Array.from(this.pendingElements));
          this.pendingElements.clear();
          this.pendingrAF = null;
        });
      }
    }
  }

  /**
   * Translate a DOM element or fragment asynchronously using this
   * `DOMLocalization` object.
   *
   * Manually trigger the translation (or re-translation) of a DOM fragment.
   * Use the `data-l10n-id` and `data-l10n-args` attributes to mark up the DOM
   * with information about which translations to use.
   *
   * Returns a `Promise` that gets resolved once the translation is complete.
   *
   * @param   {DOMFragment} frag - Element or DocumentFragment to be translated
   * @returns {Promise}
   */
  translateFragment(frag) {
    return this.translateElements(this.getTranslatables(frag));
  }

  /**
   * Translate a list of DOM elements asynchronously using this
   * `DOMLocalization` object.
   *
   * Manually trigger the translation (or re-translation) of a list of elements.
   * Use the `data-l10n-id` and `data-l10n-args` attributes to mark up the DOM
   * with information about which translations to use.
   *
   * Returns a `Promise` that gets resolved once the translation is complete.
   *
   * @param   {Array<Element>} elements - List of elements to be translated
   * @returns {Promise}
   */
  async translateElements(elements) {
    if (!elements.length) {
      return undefined;
    }

    const keys = elements.map(this.getKeysForElement);
    const translations = await this.formatMessages(keys);
    return this.applyTranslations(elements, translations);
  }

  /**
   * Applies translations onto elements.
   *
   * @param {Array<Element>} elements
   * @param {Array<Object>}  translations
   * @private
   */
  applyTranslations(elements, translations) {
    this.pauseObserving();

    for (let i = 0; i < elements.length; i++) {
      if (translations[i] !== undefined) {
        translateElement(elements[i], translations[i]);
      }
    }

    this.resumeObserving();
  }

  /**
   * Collects all translatable child elements of the element.
   *
   * @param {Element} element
   * @returns {Array<Element>}
   * @private
   */
  getTranslatables(element) {
    const nodes = Array.from(element.querySelectorAll(L10N_ELEMENT_QUERY));

    if (typeof element.hasAttribute === "function" &&
        element.hasAttribute(L10NID_ATTR_NAME)) {
      nodes.push(element);
    }

    return nodes;
  }

  /**
   * Get the `data-l10n-*` attributes from DOM elements as a two-element
   * array.
   *
   * @param {Element} element
   * @returns {Object}
   * @private
   */
  getKeysForElement(element) {
    return {
      id: element.getAttribute(L10NID_ATTR_NAME),
      args: JSON.parse(element.getAttribute(L10NARGS_ATTR_NAME) || null)
    };
  }
}

/* eslint-env browser */

function documentReady() {
  const rs = document.readyState;
  if (rs === 'interactive' || rs === 'completed') {
    return Promise.resolve();
  }

  return new Promise(
    resolve => document.addEventListener(
      'readystatechange', resolve, { once: true },
    ),
  );
}

function getMeta(elem) {
  return {
    available: elem.querySelector('meta[name="availableLanguages"]')
      .getAttribute('content')
      .split(',').map(s => s.trim()),
    default: elem.querySelector('meta[name="defaultLanguage"]')
      .getAttribute('content'),
  };
}

function getResourceLinks(elem) {
  return Array.prototype.map.call(
    elem.querySelectorAll('link[rel="localization"]'),
    el => el.getAttribute('href'),
  );
}

async function fetchResource(locale, id) {
  const url = id.replace('{locale}', locale);
  const response = await fetch(url);
  return response.text();
}

async function createContext(locale, resourceIds) {
  const ctx = new FluentBundle([locale]);

  // First fetch all resources
  const resources = await Promise.all(
    resourceIds.map(id => fetchResource(locale, id)),
  );

  // Then apply them preserving order
  for (const resource of resources) {
    ctx.addMessages(resource);
  }
  return ctx;
}

const meta = getMeta(document.head);

async function* generateMessages(resourceIds) {
  const locales = negotiateLanguages(
    navigator.languages,
    meta.available,
    {
      defaultLocale: meta.default,
    },
  );
  for (const locale of locales) {
    yield createContext(locale, resourceIds);
  }
}

const resourceIds = getResourceLinks(document.head);
document.l10n = new DOMLocalization(
  resourceIds, generateMessages,
);
window.addEventListener('languagechange', document.l10n);

document.l10n.ready = documentReady().then(() => {
  document.l10n.connectRoot(document.documentElement);
  return document.l10n.translateRoots();
});
