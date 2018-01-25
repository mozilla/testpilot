
import { Localized } from "fluent-react/compat";
import parser from "html-react-parser";
import domToReact from "html-react-parser/lib/dom-to-react";
import React from "react";

function recurseChildrenAndFindAnchors(found, node) {
  /*
    When anchors are present in a LocalizedHtml instance,
    all anchors in the ftl should have their attributes
    overwritten by the attributes in the corresponding
    anchors in the jsx. This prevents localizers from
    hijacking anchors.

    To support this, this function simply performs a
    depth-first traversal of the children of the React
    element `node` and pushes any `a` tags into the
    `found` Array.
  */
  if (typeof node === "string" || typeof node.props === "undefined") {
    return;
  }
  React.Children.forEach(node.props.children, child => {
    if (child.type === "a") {
      found.push(child);
    } else {
      recurseChildrenAndFindAnchors(found, child);
    }
  });
}


export default class LocalizedHtml extends Localized {
  render() {
    const templates = {
      anchors: [],
      insertIndex: 0,
      readIndex: 0
    };
    recurseChildrenAndFindAnchors(templates.anchors, this.props.children);

    /*
      Localized.render returns one of two things: if the
      ftl string being localized contains ${template}
      placeholders, it will return an element whose children
      are strings and object instances representing the
      placeholders. If the ftl string being localized does
      not contain template placeholders, it will return an
      element with a string children prop.
    */
    const result = super.render();
    /*
      If we are being used in the tests, just return the
      placeholder content which Localized returns in this
      case.
    */
    if (typeof this.context.l10n === "undefined") {
      return result;
    }

    let joined;
    if (typeof result.props.children === "string") {
      /*
        If children is a string, there are
        no template substitutions to make. Simply
        prepare for parsing the ftl element as html.
      */
      joined = result.props.children;
    } else {
      /*
        Otherwise, join together result.props.children,
        replacing template elements with the sentinel
        html <span>///</span> and storing the original
        template elements in `templates`.
      */
      const mapped = React.Children.map(result.props.children, child => {
        if (typeof child === "string") {
          return child;
        }
        templates.insertIndex++;
        templates[templates.insertIndex] = child;
        return "<span>///</span>";
      });

      if (mapped === null) {
        joined = "";
      } else {
        joined = mapped.join("");
      }
    }

    /*
      Now that we have replaced any template nodes with
      <span>///</span> and produced one html string from
      the ftl string, we can use html-react-parser to parse
      the string into React elements. html-react-parser
      takes an options object which has a replace method
      which takes a node (in htmlparser2.parseDOM format)
      and returns React elements. If `node` is
      <span>///</span>, we return the template node
      stored earlier. If `node` is an anchor, we copy
      all the attributes from the jsx anchor to the one
      parsed from the ftl.
    */
    const options = {
      replace: node => {
        // node has the same structure as htmlparser2.parseDOM
        // https://github.com/fb55/domhandler#example
        if (node.type === "tag") {
          if (node.name === "span" &&
              node.children && node.children.length === 1 &&
              node.children[0].data === "///") {
            templates.readIndex++;
            return templates[templates.readIndex];
          } else if (node.name === "a") {
            if (templates.anchors.length) {
              const anchor = templates.anchors.shift();
              return React.cloneElement(
                anchor,
                {
                  children: domToReact(node.children, options),
                  ...anchor.props
                }
              );
            }
            throw new Error(`ftl string "${this.props.id}" did not have as many anchors as the jsx`);
          }
        }
        return undefined;
      }
    };

    const parsed = parser(joined, options);
    return React.cloneElement(result, { children: parsed });
  }
}
