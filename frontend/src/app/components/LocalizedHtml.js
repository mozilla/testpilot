
import { Localized } from 'fluent-react/compat';
import parser from 'html-react-parser';
import domToReact from 'html-react-parser/lib/dom-to-react';
import React from 'react';

function recurseChildrenAndFindAnchors(found, node) {
  if (typeof node === 'string' || typeof node.props === 'undefined') {
    return;
  }
  React.Children.forEach(node.props.children, child => {
    if (child.type === 'a') {
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

    const result = super.render();
    if (typeof this.context.l10n === 'undefined') {
      return result;
    }

    let joined;
    if (typeof result.props.children === 'string') {
      joined = result.props.children;
    } else {
      joined = React.Children.map(result.props.children, child => {
        if (typeof child === 'string') {
          return child;
        }
        templates.insertIndex++;
        templates[templates.insertIndex] = child;
        return '<span>///</span>';
      }).join('');
    }

    const options = {
      replace: node => {
        // node has the same structure as htmlparser2.parseDOM
        // https://github.com/fb55/domhandler#example
        if (node.type === 'tag') {
          if (node.name === 'span' &&
              node.children && node.children.length === 1 &&
              node.children[0].data === '///') {
            templates.readIndex++;
            return templates[templates.readIndex];
          } else if (node.name === 'a') {
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
            console.error('ftl string did not have as many anchors as the jsx');
          }
        }
        return undefined;
      }
    };

    const parsed = parser(joined, options);
    return React.cloneElement(result, { children: parsed });
  }
}
