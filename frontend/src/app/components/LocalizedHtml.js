
import { Localized } from 'fluent-react/compat';
import parser from 'html-react-parser';
import React from 'react';


function recurseChildren(templates, node) {
  if (typeof node === 'string') {
    return node;
  }
  const children = React.Children.map(node.props.children, child => {
    if (child.type === 'span' && child.props.children === '///') {
      templates.readIndex++;
      return templates[templates.readIndex];
    }
    return recurseChildren(templates, child);
  });
  return React.cloneElement(node, { children });
}


export default class LocalizedHtml extends Localized {
  render() {
    const result = super.render();
    if (typeof result.props.children === 'string') {
      return React.cloneElement(result, { children: parser(result.props.children) });
    }
    if (typeof this.context.l10n === 'undefined') {
      return result;
    }

    const templates = {
      insertIndex: 0,
      readIndex: 0
    };
    const joined = React.Children.map(result.props.children, child => {
      if (typeof child === 'string') {
        return child;
      }
      templates.insertIndex++;
      templates[templates.insertIndex] = child;
      return '<span>///</span>';
    }).join('');

    const parsed = parser(joined);
    const newChildren = parsed.map(
      child => recurseChildren(templates, child)
    );

    return React.cloneElement(result, { children: newChildren });
  }
}
