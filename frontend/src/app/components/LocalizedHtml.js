
import { Localized } from 'fluent-react/compat';
import parser from 'html-react-parser';
import React from 'react';

export default class LocalizedHtml extends Localized {
  render() {
    const result = super.render();
    if (typeof result.props.children === 'string') {
      return React.cloneElement(result, { children: parser(result.props.children) });
    }
    return result;
  }
}
