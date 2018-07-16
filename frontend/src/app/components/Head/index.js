import React from "react";

type HeadProps = {
  metaTitle: string,
  metaDescription: string,
  availableLocales: string,
  canonicalPath: string,
  imageFacebook: string,
  imageTwitter: string
}

export default class Head extends React.Component {
  props: HeadProps

  render() {
    const {
      metaTitle, metaDescription,
      availableLocales, canonicalPath,
      imageFacebook, imageTwitter
    } = this.props;

    const canonicalUrl = `https://testpilot.firefox.com/${canonicalPath}`;

    return (
      <head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/static/images/favicon.ico" />
        <link rel="stylesheet" href="https://code.cdn.mozilla.net/fonts/fira.css" />
        <link rel="stylesheet" href="/static/styles/experiments.css" />
        <link rel="stylesheet" href="/static/app/app.css" />

        <meta name="defaultLanguage" content="en-US" />
        <meta name="availableLanguages" content={availableLocales} />
        <meta name="viewport" content="width=device-width" />

        <link rel="alternate" type="application/atom+xml" href="/feed.atom" title="Atom Feed" />
        <link rel="alternate" type="application/rss+xml" href="/feed.rss" title="RSS Feed" />
        <link rel="alternate" type="application/json" href="/feed.json" title="JSON Feed" />

        <link rel="canonical" href={canonicalUrl} />

        <title>{metaTitle}</title>

        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="description" content={metaDescription} />
        <meta property="og:description" content={metaDescription} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:card" content="summary" />
        <meta property="og:image" content={imageFacebook} />
        <meta name="twitter:image" content={imageTwitter} />
        <meta property="og:url" content={canonicalUrl} />
      </head>
    );
  }

}
