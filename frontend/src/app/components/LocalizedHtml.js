import {Children, cloneElement} from "react";
import { withLocalization } from "fluent-react/compat";
import parser from "html-react-parser";

const MISSING_TRANSLATION = Symbol();

// Retrieve the translation for the id, parse it with html-react-parser, and
// render the wrapped element using the parsed result as its children.
function LocalizedHtml({children, id, getString}) {
  const wrappedElement = Children.only(children);

  // By default, when the translation is missing, getString returns the
  // identifier as fallback. Instead, pass a custom symbol as the fallback to be
  // used and return the wrapped element without any modifications. This is also
  // used in tests.
  const translation = getString(id, null, MISSING_TRANSLATION);
  if (translation === MISSING_TRANSLATION) {
    return wrappedElement;
  }

  return cloneElement(wrappedElement, {
    // The parsed result may be a single React element or an array of elements.
    // Pass it explicitly as the children prop (rather than as ...children) to
    // handle this ambiguity.
    children: parser(translation)
  });
}

export default withLocalization(LocalizedHtml);
